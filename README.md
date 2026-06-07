# VeridIA — Inteligência que comprova

Plataforma da **ZNIT** de pré-viabilidade de projetos de carbono no agro. O
produtor rural informa o CAR e, em poucos minutos, a VeridIA cruza dados
públicos e satélite para mostrar se a propriedade tem potencial para um projeto
de carbono — com linguagem simples, sem jargão e transparente sobre incertezas.

Implementa os dois PRDs em `reference/PRD_VeridIA.pdf`:

- **PRD 01 — Input de dados:** CAR → confirmação no mapa → uso atual → intenção → elegibilidade → documentos
- **PRD 02 — Pré-viabilidade:** matriz de elegibilidade → Score de Prontidão (0–100) → rotas candidatas → relatório preliminar

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Leaflet** + imagem de satélite Esri (sem token) para o mapa
- **Supabase** (Postgres) para persistência — opcional; sem credenciais, roda em modo local (localStorage)

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
```

Para testar o fluxo, use o CAR de exemplo `MT-5103403-A1B2C3D4` (qualquer CAR
no formato `UF-NNNNNNN-XXXX` funciona; CARs terminados em `0000` simulam "não
encontrado").

Outros comandos:

```bash
npm run build      # build de produção
npm run typecheck  # checagem de tipos
npm run start      # servir o build
```

## Estrutura

```
src/
  app/
    page.tsx                      Landing
    analise/[id]/
      propriedade/                Etapa 1 — CAR e caminhos alternativos
      mapa/                       Etapa 2 — confirmação visual (Leaflet)
      uso/                        Etapa 3 — conversa sobre uso atual
      intencao/                   Etapa 4 — intenção do proprietário
      elegibilidade/              Etapa 5 — perguntas de elegibilidade
      documentos/                 Etapa 6 — upload assíncrono
      resultado/                  Resultado Preliminar
      relatorio/                  Relatório de 5 páginas (imprimir/PDF)
    backoffice/                   Visão técnica do especialista
    api/submissions/              Sincronização com Supabase (quando configurado)
  lib/
    types.ts                      Modelo de dados (PRD 01 §8 + PRD 02 §17)
    engine/                       Motor de pré-viabilidade (score, rotas, regras)
    copy.ts                       Voz da VeridIA + labels
    store.ts / useSubmission.ts   Persistência local + auto-save
  data/                           Provedores de dados externos (mock plugável)
  components/                     Design system + componentes da VeridIA
```

## Integrações externas

O MVP usa um **provedor mock realista** (`src/data/mockProvider.ts`) atrás da
interface `GeoDataProvider`. Para conectar APIs reais (SICAR, MapBiomas via
Earth Engine, INPE), implemente a interface em `src/data/provider.ts` e troque
`geoProvider` em `mockProvider.ts`. A UI e o motor não mudam.

## Supabase (opcional)

1. Crie um projeto no Supabase e rode `src/lib/db/schema.sql` no SQL Editor.
2. Copie `.env.example` para `.env.local` e preencha as variáveis.
3. As submissões passam a ser persistidas em Postgres e o backoffice lê de lá.

Sem `.env.local`, tudo funciona em modo local (localStorage no navegador).

## Marca

Verde-água `#56B7A5` + neutros (paleta oficial em `assets/color-codes.pdf`).
Tipografia Gotham (substituída por Montserrat, alternativa geométrica livre).
A VeridIA fala em primeira pessoa do produto e nunca usa jargão técnico na
camada principal.

---

A VeridIA é uma ferramenta de triagem preliminar. Não substitui análise
técnica, validação por certificadora, registro em standard ou parecer jurídico.
