# PainelATC

Painel de controle ATC web para controladores de torre nas redes IVAO e VATSIM.

Substitui anotações manuais (Notion, bloco de notas) por um sistema organizado com fraseologia ICAO pré-preenchida, gerenciamento de múltiplas aeronaves e rastreamento de fases de controle.

## Funcionalidades

- Seleção de posição ATC (DEL, GND, TWR, Torre Combinada)
- Fraseologia padrão ICAO em Português e Inglês
- Alternância de idioma por aeronave
- ATIS estático com auto-preenchimento nos templates
- Configuração de frequências (solo, torre, saída)
- Gerenciamento de pistas
- Navegação por fases de controle (Autorização → Pushback → Táxi → Decolagem → Pouso → Táxi Pós-Pouso)
- Copiar fraseologia para o clipboard com um clique
- Persistência de sessão via localStorage

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
