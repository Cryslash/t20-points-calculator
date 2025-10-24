/// <reference types="@league-of-foundry-developers/foundry-vtt-types" />
import { CalculatorApp } from './ui/CalculatorApp';

Hooks.on('renderActorSheet', (app: ActorSheet, html: JQuery, data: any) => {
  // Evita duplicar o botão se a ficha for re-renderizada
  if (html.find('.t20calc-button').length) return;

  const header = html.find('.window-header .window-title');
  if (!header.length) return;

  // Cria o botão
  const button = $(
    `<a class="t20calc-button" title="Abrir Calculadora T20" style="margin-left: 8px;">
      <i class="fas fa-calculator"></i></a>`,
  );

  // Quando clicar, abre a calculadora
  button.on('click', () => {
    const appCalc = new CalculatorApp(app.actor);
    appCalc.render(true);
  });

  // Adiciona o botão ao cabeçalho da ficha
  header.after(button);
});
