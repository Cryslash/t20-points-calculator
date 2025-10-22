# 🧮 Calculadora de Pontos — Tormenta20

Um módulo para **Foundry VTT** que adiciona uma **calculadora interativa de compra de pontos** para criação e ajuste de personagens no sistema **Tormenta20**.

Com este módulo, jogadores e mestres podem distribuir pontos nos atributos de forma prática e automatizada, diretamente dentro da ficha do personagem!

---

## ✨ Funcionalidades

- Interface simples e integrada ao Foundry.
- Controle automático de pontos disponíveis (inicia com **10 pontos**).
- Cálculo de custo de atributos baseado nas regras de **Tormenta20**.
- Permite valores negativos (-1) para gerar pontos extras.
- Soma automática de bônus raciais e outros modificadores.
- Botão de **Aplicar na Ficha** que atualiza os atributos do personagem.
- Botão da calculadora disponível diretamente na ficha do personagem.

---

## 🖼️ Interface

### 📍 Localização do botão
A calculadora pode ser aberta diretamente pela ficha do personagem, através do ícone destacado abaixo:

![Botão da Calculadora](https://raw.githubusercontent.com/Cryslash/t20-points-calculator/main/docs/Captura%20de%20tela%202025-10-22%20155754.png)

---

### 🧮 Janela da Calculadora
A janela exibe todos os atributos principais, os campos de valor, bônus e custo, além do total de pontos restantes.

![Interface da Calculadora](https://raw.githubusercontent.com/Cryslash/t20-points-calculator/main/docs/Captura%20de%20tela%202025-10-22%20155807.png)

---

## ⚙️ Instalação

### 📦 Instalar via Manifest
Cole o link abaixo no campo **Manifest URL** do Foundry:
https://raw.githubusercontent.com/Cryslash/t20-points-calculator/main/public/module.json

### 🖐️ Instalação Manual
1. Baixe o arquivo `.zip` da [última release](https://github.com/Cryslash/t20-points-calculator/releases/latest).
2. Extraia o conteúdo na pasta:
3. Reinicie o Foundry e ative o módulo em:
Configurações > Gerenciar Módulos


---

## 📘 Como Usar

1. Abra a ficha do personagem.
2. Clique no **ícone da calculadora** no canto superior.
3. Ajuste os atributos nos campos de “Valor”.
4. Observe os pontos restantes diminuírem automaticamente.
5. Quando os pontos chegarem a **zero**, clique em **Aplicar na Ficha**.
6. Os valores serão aplicados automaticamente nos atributos da ficha.

---

## 🧠 Detalhes Técnicos

- Desenvolvido em **TypeScript + Vite**.
- Compatível com **Foundry VTT v13+**.
- Utiliza o sistema de templates **Handlebars**.
- Totalmente integrado ao sistema **Tormenta20**.
- Código modular e pronto para expansão (ex: integração com geração de ficha automática).

---

## 🧑‍💻 Autor

**Crystofher Lins**  
Desenvolvedor e criador da Calculadora T20 para Foundry VTT.

📫 Contato: [GitHub @Cryslash](https://github.com/Cryslash)

---

## ⚖️ Licença

Distribuído sob a licença **MIT**.  
Sinta-se à vontade para modificar, melhorar e contribuir com o projeto.

