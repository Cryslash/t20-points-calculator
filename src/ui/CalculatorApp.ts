/// <reference types="@league-of-foundry-developers/foundry-vtt-types" />
import '../../public/styles/t20calc.css';

declare const foundry: any;

type AttributeField = 'value' | 'racial' | 'bonus' | 'total' | 'cost';
type AttributeData = {
  label: string;
  value: number;
  racial: number;
  bonus: number;
  total: number;
  cost: number;
  _ageBonus?: number;
};

const COST_TABLE: Record<number, number> = {
  [-1]: -1,
  [0]: 0,
  [1]: 1,
  [2]: 2,
  [3]: 4,
  [4]: 7,
};

export class CalculatorApp extends Application {
  constructor(private targetActor?: Actor) {
    super();
  }

  attributes: Record<string, AttributeData> = {
    for: { label: 'Força', value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
    des: {
      label: 'Destreza',
      value: 0,
      racial: 0,
      bonus: 0,
      total: 0,
      cost: 0,
    },
    con: {
      label: 'Constituição',
      value: 0,
      racial: 0,
      bonus: 0,
      total: 0,
      cost: 0,
    },
    int: {
      label: 'Inteligência',
      value: 0,
      racial: 0,
      bonus: 0,
      total: 0,
      cost: 0,
    },
    sab: {
      label: 'Sabedoria',
      value: 0,
      racial: 0,
      bonus: 0,
      total: 0,
      cost: 0,
    },
    car: { label: 'Carisma', value: 0, racial: 0, bonus: 0, total: 0, cost: 0 },
  };

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 't20calc',
      title: 'Calculadora T20',
      template: 'modules/t20calc/templates/calculator.hbs',
      width: 550,
      height: 'auto',
      resizable: true,
    });
  }

  getData() {
    return {
      attributes: Object.entries(this.attributes).map(([key, data]) => ({
        key,
        ...data,
      })),
      remaining: this.getRemainingPoints(),
    };
  }

  private updateAttribute(attr: string, html: JQuery) {
    const d = this.attributes[attr];
    d.total = d.value + d.racial + d.bonus;
    d.cost = COST_TABLE[d.value] ?? 0;
    html.find(`input.total[data-attr='${attr}']`).val(String(d.total));
    html.find(`.cost[data-attr='${attr}']`).text(String(d.cost));
  }

  private refreshRemaining(html: JQuery) {
    const remaining = this.getRemainingPoints();
    html
      .find('#remaining')
      .text(remaining)
      .css('color', remaining < 0 ? 'red' : 'black');
    html.find('.t20calc__apply').prop('disabled', remaining !== 0);
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    const inputs = html.find('input[data-field]');

    // Foco seleciona tudo
    html.on('focus', 'input[data-field]', function () {
      (this as HTMLInputElement).select();
    });

    // Ao sair vazio = 0
    html.on('blur', 'input[data-field]', ev => {
      const el = ev.currentTarget as HTMLInputElement;
      if (!el.value.trim()) {
        el.value = '0';
        $(el).trigger('input');
      }
    });

    html.on('input', 'input[data-field]', ev => {
      const el = ev.currentTarget as HTMLInputElement;
      const attr = el.dataset.attr!;
      const field = el.dataset.field as AttributeField;
      const raw = el.value.trim();

      // Permite digitar vazio ou "-"
      if (raw === '' || raw === '-') return;

      let val = parseInt(raw);
      if (isNaN(val)) return; // não atualiza enquanto é inválido

      this.attributes[attr][field] = val;
      this.updateAttribute(attr, html);
      this.refreshRemaining(html);
    });

    // Limita o valor entre -1 e 4 apenas ao sair do campo
    html.on('blur', 'input[data-field]', ev => {
      const el = ev.currentTarget as HTMLInputElement;
      const attr = el.dataset.attr!;
      const field = el.dataset.field as AttributeField;

      let val = parseInt(el.value);
      if (isNaN(val)) val = 0;

      if (field === 'value') {
        val = Math.max(-1, Math.min(4, val)); // tranca o intervalo
        el.value = String(val);
      }

      this.attributes[attr][field] = val;
      this.updateAttribute(attr, html);
      this.refreshRemaining(html);
    });

    // Navegação vertical (Tab e Shift+Tab)
    html.on('keydown', 'input[data-field]', function (event) {
      if (event.key !== 'Tab') return;
      event.preventDefault();

      const current = inputs.index(this);
      const cols = 3;
      const rows = inputs.length / cols;
      const row = Math.floor(current / cols);
      const col = current % cols;

      const next = event.shiftKey
        ? row > 0
          ? (row - 1) * cols + col
          : (rows - 1) * cols + ((col - 1 + cols) % cols)
        : row < rows - 1
        ? (row + 1) * cols + col
        : (col + 1) % cols;
      (inputs[next] as HTMLInputElement)?.focus();
    });

    // Envelhecimento
    const applyAge = () => {
      for (const k in this.attributes) {
        const d = this.attributes[k];
        if (d._ageBonus) d.bonus -= d._ageBonus;
        d._ageBonus = 0;
      }

      const mad = html.find('#idade-maduro').prop('checked');
      const vel = html.find('#idade-velho').prop('checked');

      let modF = 0,
        modM = 0;
      if (mad) {
        modF -= 1;
        modM += 1;
      }
      if (vel) {
        modF -= 2;
        modM += 1;
      }

      const applyBonus = (keys: string[], mod: number) => {
        for (const k of keys) {
          const d = this.attributes[k];
          d.bonus += mod;
          d._ageBonus = mod;
          html
            .find(`input[data-attr='${k}'][data-field='bonus']`)
            .val(String(d.bonus));
          this.updateAttribute(k, html);
        }
      };

      applyBonus(['for', 'des', 'con'], modF);
      applyBonus(['int', 'sab', 'car'], modM);

      const info = html.find('#idade-info');
      info.text(
        !mad && !vel
          ? 'Nenhum bônus de idade aplicado.'
          : vel
          ? 'Bônus de idade aplicado: Físicos -3, Mentais/Sociais +2.'
          : 'Bônus de idade aplicado: Físicos -1, Mentais/Sociais +1.',
      );
      this.refreshRemaining(html);
    };

    html.on('change', '#idade-maduro', () => {
      if (!html.find('#idade-maduro').prop('checked'))
        html.find('#idade-velho').prop('checked', false);
      applyAge();
    });

    html.on('change', '#idade-velho', () => {
      if (html.find('#idade-velho').prop('checked'))
        html.find('#idade-maduro').prop('checked', true);
      applyAge();
    });

    // Botão reset
    html.on('click', '.t20calc__reset', async () => {
      const confirmed = await Dialog.confirm({
        title: 'Confirmar Reset',
        content: `<p>Tem certeza que deseja <b>resetar todos os valores</b> da calculadora?</p>`,
        yes: () => true,
        no: () => false,
        defaultYes: false,
      });

      if (!confirmed) return;

      for (const k in this.attributes) {
        const d: any = this.attributes[k];
        d.value = 0;
        d.racial = 0;
        d.bonus = 0;
        d.total = 0;
        d.cost = 0;
        d._ageBonus = 0;
        html.find(`input[data-attr='${k}'][data-field='value']`).val('0');
        html.find(`input[data-attr='${k}'][data-field='racial']`).val('0');
        html.find(`input[data-attr='${k}'][data-field='bonus']`).val('0');
        html.find(`.total[data-attr='${k}']`).val('0');
        html.find(`.cost[data-attr='${k}']`).text('0');
      }

      (html.find('#idade-maduro') as JQuery<HTMLInputElement>).prop(
        'checked',
        false,
      );
      (html.find('#idade-velho') as JQuery<HTMLInputElement>).prop(
        'checked',
        false,
      );
      html.find('#idade-info').text('Nenhum bônus de idade aplicado.');
      html.find('#remaining').text('10').css('color', 'black');
      html.find('.t20calc__apply').prop('disabled', true);

      ui.notifications?.info('Calculadora resetada com sucesso!');
    });

    // Botão Aplicar
    html.on('click', '.t20calc__apply', async () => {
      const applied = await this.applyToActor();

      // Só fecha se o método retornar explicitamente true
      if (applied === true) {
        this.close();
      }
    });
  }

  getRemainingPoints() {
    return (
      10 - Object.values(this.attributes).reduce((sum, a) => sum + a.cost, 0)
    );
  }

  async applyToActor() {
    const actor = this.targetActor ?? canvas.tokens.controlled[0]?.actor;
    if (!actor) {
      ui.notifications?.warn('Nenhum personagem selecionado!');
      return false;
    }

    const confirmed = await Dialog.confirm({
      title: 'Confirmar Aplicação',
      content: `<p>Deseja aplicar os valores na ficha de <b>${actor.name}</b>?</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false,
    });

    if (!confirmed) {
      // jogador clicou “Não”
      return false;
    }

    const updates: Record<string, number> = {};
    for (const [key, data] of Object.entries(this.attributes)) {
      updates[`system.atributos.${key}.base`] = data.value + data.bonus;
      updates[`system.atributos.${key}.racial`] = data.racial;
    }

    await actor.update(updates);
    ui.notifications?.info(`Atributos aplicados com sucesso em ${actor.name}!`);
    return true;
  }
}
