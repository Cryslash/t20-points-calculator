/// <reference types="@league-of-foundry-developers/foundry-vtt-types" />
import { CalculatorApp } from "./ui/CalculatorApp";

Hooks.once("ready", () => {
  console.log("T20 Calculator | Módulo carregado com sucesso.");

  (window as any).t20calc = () => {
    const app = new CalculatorApp();
    app.render(true);
  };

  ui.notifications?.info("Calculadora T20 carregada! Use t20calc() no console para abrir.");
});
