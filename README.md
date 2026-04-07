# PainelATC

Painel web de fraseologia aeronáutica para controladores e pilotos nas redes IVAO e VATSIM.

Substitui anotações manuais (Notion, bloco de notas) por um sistema organizado com fraseologia ICAO pré-preenchida, gerenciamento de múltiplas aeronaves e rastreamento de fases de controle.

## Funcionalidades

- Modo Controlador e modo Piloto com fraseologia específica para cada papel
- Seleção de posição ATC (DEL, GND, TWR, Torre Combinada)
- Fraseologia padrão ICAO em Português, Inglês e Espanhol
- Seleção de idioma por aeronave (PT / EN / ES)
- ATIS estático com auto-preenchimento nos templates (aeroporto, pistas, vento, QNH, transponder, letra ATIS)
- Pistas separadas para decolagem e pouso
- Configuração de frequências (solo, torre, saída) com auto-preenchimento nos handoffs
- Handoffs entre posições (contate solo/torre) — ocultos no modo Torre Combinada
- Navegação por fases de controle (Autorização → Pushback → Táxi → Decolagem → Pouso → Táxi Pós-Pouso)
- Seção de exceções separada visualmente (arremetida, backtrack)
- Tabs de aeronaves com cores por fase para identificação rápida
- Reordenação de aeronaves por prioridade (◀ ▶)
- Copiar fraseologia para o clipboard com um clique
- Notas gerais da sessão e notas por aeronave
- Persistência de sessão via localStorage com restauração ao reabrir
- Deploy estático (Vercel, Netlify, etc.)

## Tech Stack

- React + TypeScript
- Vite
- CSS Modules
- Vitest + fast-check

## Como rodar

```bash
npm install
npm run dev
```

## Testes

```bash
npm test
```

## Deploy

A aplicação é uma SPA estática. Para deploy na Vercel:

1. Suba o código para o GitHub
2. Conecte o repositório na Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
