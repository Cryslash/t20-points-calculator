/// <reference types="@league-of-foundry-developers/foundry-vtt-types" />
declare const foundry: any;

// Tipos fortes para as propriedades de cada atributo
type AttributeField = "value" | "racial" | "bonus" | "total" | "cost";

type AttributeData = {
  label: string;
  value: number;
  racial: number;
  bonus: number;
  total: number;
  cost: number;
};

// Tabela de custo conforme regras definidas
const COST_TABLE: Record<number, number> = {
  [-1]: -1,
  [0]: 0,
  [1]: 1,
  [2]: 2,
  [3]: 4,
  [4]: 7,
};

export class CalculatorApp extends Application {
  // Estado inicial dos atributos
  attributes: Record<string, AttributeData> = {
    for: { label: "Força", value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
    des: { label: "Destreza", value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
    con: { label: "Constituição", value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
    int: { label: "Inteligência", value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
    sab: { label: "Sabedoria", value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
    car: { label: "Carisma", value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
  };

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "t20calc",
      title: "Calculadora T20",
      template: "modules/t20calc/templates/calculator.hbs",
      width: 550,
      height: "auto",
      resizable: true,
    });
  }

  getData() {
    const remaining = this.getRemainingPoints();
    return {
      attributes: Object.entries(this.attributes).map(([key, data]) => ({
        key,
        ...data,
      })),
      remaining,
    };
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Atualiza valores quando qualquer input mudar
    html.find("input").on("input", (ev) => {
  const input = ev.currentTarget as HTMLInputElement;
  const attr = input.dataset.attr!;
  const field = input.dataset.field as AttributeField;
  const val = parseInt(input.value) || 0;

  // Atualiza o campo certo
  this.attributes[attr][field] = val;

  // Atualiza total e custo
  const data = this.attributes[attr];
  data.total = data.value + data.racial + data.bonus;
  data.cost = COST_TABLE[data.value] ?? 0;

  // Atualiza DOM
  html.find(`.total[data-attr='${attr}']`).text(data.total.toString());
  html.find(`.cost[data-attr='${attr}']`).text(data.cost);

  // Atualiza pontos restantes e botão
  const remaining = this.getRemainingPoints();
  const span = html.find("#remaining");
  span.text(remaining.toString());
  span.css("color", remaining < 0 ? "red" : "black");

  const applyButton = html.find("button.apply");
  applyButton.prop("disabled", remaining !== 0);
});

    // Aplicar valores na ficha
    html.find("button.apply").on("click", () => this.applyToActor());
  }

  // Calcula pontos restantes
  getRemainingPoints(): number {
    const totalCost = Object.values(this.attributes).reduce((a, b) => a + b.cost, 0);
    return 10 - totalCost;
  }

  // Aplica valores ao ator selecionado
  async applyToActor() {
    const actor = canvas.tokens.controlled[0]?.actor;
    if (!actor) {
      ui.notifications?.warn("Selecione um token para aplicar os valores!");
      return;
    }

    const updates: Record<string, number> = {};
    for (const [key, data] of Object.entries(this.attributes)) {
      updates[`system.abilities.${key}.value`] = data.total;
    }

    await actor.update(updates);
    ui.notifications?.info("Atributos aplicados ao personagem!");
  }
}
