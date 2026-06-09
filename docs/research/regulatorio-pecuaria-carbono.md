# Contexto Regulatório e Metodológico — Carbono na Pecuária Bovina a Pasto (Brasil)

> Pesquisa de apoio ao MVP de pré-viabilidade de carbono da VeridIA.
> **Aviso de transparência:** todos os números numéricos abaixo são FAIXAS de referência da
> literatura (Embrapa, IPCC, FAO, Verra, Ecosystem Marketplace) e variam fortemente por bioma,
> manejo, linha de base de degradação e qualidade do projeto. Devem ser usados como *defaults
> conservadores e provisórios* num motor de pré-viabilidade — **nunca** como promessa de retorno.
> Data da pesquisa: junho/2026.

---

## 1. APP — Área de Preservação Permanente (Lei 12.651/2012)

A APP é espaço territorial protegido cuja função é preservar recursos hídricos, estabilidade
geológica, biodiversidade e o solo. É definida no **Art. 3º, II** e detalhada no **Art. 4º** do
Código Florestal (Lei 12.651/2012). Não depende de a vegetação existir hoje — a APP é geográfica
(definida pela feição do terreno/água), e a vegetação nela deve ser **mantida ou recomposta**.

### 1.1 Faixas marginais de cursos d'água (Art. 4º, I)

Medidas a partir da **borda da calha do leito regular** (não do nível de cheia), para qualquer
curso d'água natural perene ou intermitente (exceto efêmeros):

| Largura do curso d'água | Faixa de APP (cada margem) |
|---|---|
| até 10 m | **30 m** |
| 10 a 50 m | **50 m** |
| 50 a 200 m | **100 m** |
| 200 a 600 m | **200 m** |
| acima de 600 m | **500 m** |

### 1.2 Demais feições de APP (Art. 4º)

- **Nascentes e olhos d'água perenes** (inc. IV): raio mínimo de **50 m**, qualquer que seja a
  situação topográfica.
- **Lagos e lagoas naturais** (inc. II): faixa de **30 m** (área urbana) a **100 m** (área rural,
  lagoa > 20 ha), ou 50 m em área rural com até 20 ha.
- **Reservatórios artificiais** decorrentes de barramento de cursos d'água naturais (inc. III):
  faixa definida na licença ambiental.
- **Encostas** (inc. V): declividade **> 45°** (equivalente a 100% na linha de maior declive).
- **Topo de morro, montes, montanhas e serras** (inc. IX): elevações com **altura mínima de 100 m**
  **E** **inclinação média maior que 25°**; protege-se o terço superior, contado a partir da curva
  de nível correspondente a **2/3 da altura** em relação à base (base = ponto de sela mais próximo
  em relevo ondulado).
- **Altitude > 1.800 m** (inc. X); **restingas e manguezais** (inc. VI e VII); **veredas** (inc. XI).

### 1.3 CRÍTICO PARA ADICIONALIDADE — recuperação obrigatória (passivo) vs. excedente/voluntária

Este é o ponto que mais ameaça a adicionalidade de um crédito agrícola e precisa estar explícito no
motor:

- **Área de recuperação obrigatória (passivo ambiental):** APP degradada/desmatada cuja recomposição
  a lei **já exige**. Recompor essa área é cumprimento de obrigação legal — **não há adicionalidade**
  (a redução/remoção não é "adicional" porque aconteceria de qualquer forma por força de lei). Esse
  carbono **não deve gerar crédito** em padrões sérios (Verra, Gold Standard). Marcar como **NÃO
  ELEGÍVEL** no motor.

- **Regime de áreas rurais consolidadas (Art. 61-A):** atividades agrossilvipastoris iniciadas até
  **22/07/2008** podem continuar, mas há **recomposição obrigatória mínima de APP de margem de rio**,
  escalonada pelo tamanho do imóvel (em **módulos fiscais — MF**):
  - até 1 MF → **5 m**
  - 1 a 2 MF → **8 m**
  - 2 a 4 MF → **15 m**
  - acima de 4 MF → **20 a 100 m** (definida no PRA, conforme a regra geral do Art. 4º).
  Limites de teto (Art. 61-B): recomposição não ultrapassa 10% da área para imóveis ≤ 2 MF e 20%
  para 2–4 MF. **Tudo isso é passivo legal → sem adicionalidade.**

- **Área excedente / preservação voluntária:** vegetação nativa conservada **acima do que a lei
  obriga** (excedente de Reserva Legal, APP já cumprida e preservada além do mínimo, recomposição
  voluntária de área não exigida). Aqui **pode haver adicionalidade**, desde que se demonstre que a
  conservação/recuperação não era compulsória e que existe barreira (econômica/financeira) ao
  cenário de referência. É nesse excedente que mora a oportunidade legítima de crédito.

- **Reconhecimento legal recente:** a **Lei 15.042/2024** (SBCE — mercado regulado) exclui a
  produção primária agropecuária das obrigações do sistema, mas reconhece (arts. 43 e 46) que APP,
  Reserva Legal e áreas de uso restrito **podem gerar créditos**, desde que cumpram requisitos de
  mensuração, verificação e registro — e, na prática, desde que respeitem adicionalidade.
  Conclusão operacional: a regra de mercado **não dispensa** o teste de adicionalidade.

> **Regra de ouro do motor:** separe sempre `area_passivo_obrigatorio` (não elegível) de
> `area_excedente_voluntaria` (potencialmente elegível). Na dúvida, trate como passivo (conservador).

---

## 2. Reserva Legal (RL) — Art. 12 e seguintes

Percentual da propriedade rural que deve manter cobertura de vegetação nativa, **variável por
bioma/região**:

| Localização | % de Reserva Legal |
|---|---|
| Amazônia Legal — área de **floresta** | **80%** |
| Amazônia Legal — área de **cerrado** | **35%** |
| Amazônia Legal — campos gerais | 20% |
| **Demais regiões do país** (Mata Atlântica, Caatinga, Pampa, Pantanal, Cerrado fora da Amazônia Legal) | **20%** |

- **Excedente de RL:** vegetação nativa preservada **acima** do percentual mínimo legal. É o ativo
  ambiental que pode ser monetizado.
- **CRA — Cota de Reserva Ambiental (Art. 44):** título nominativo representando **1 ha** de área
  com vegetação nativa **excedente** à RL exigida (ou em recomposição). Pode ser usado para
  **compensar** déficit de RL em outro imóvel do **mesmo bioma** (compensação por bioma confirmada
  pelo STF). É um mercado distinto do mercado de carbono, mas relevante: a mesma área excedente pode,
  em tese, gerar tanto CRA quanto crédito de carbono — exigindo cuidado para **evitar dupla contagem**.
- **Adicionalidade da RL:** manter a RL no mínimo legal **não é adicional** (é obrigatório). Só o
  **excedente** ou a recomposição de área não exigida tende a passar no teste de adicionalidade.

---

## 3. Recuperação de pastagem degradada → carbono no solo (SOC)

O Brasil tem ~50+ milhões de ha de pastagens em algum grau de degradação. Recuperar essas áreas
aumenta a matéria orgânica e estoca carbono no solo (SOC). Faixas de referência (tCO2e/ha/ano):

| Rota de manejo | Sequestro de SOC (tCO2e/ha/ano) | Fonte / observação |
|---|---|---|
| Recuperação de pastagem degradada | **~1,5 a 4,4** (típico ~3,0–3,5) | Embrapa: balanços positivos de até 3,5 tCO2e/ha; taxas de 3,3–4,4 tC/ha/ano em casos de alta recuperação (atenção: tC ≠ tCO2). "Mais de 3 t CO2/ha/ano" em pastos bem manejados. |
| Pastejo rotacionado / intensificação de pasto | **~1,0 a 3,5** | Maior estoque de SOC em sistemas intensivos por melhor manejo da forrageira e fertilidade; sobreposto à faixa acima. |
| ILPF / integração lavoura-pecuária-floresta | **~5 a 15** (solo + biomassa arbórea); valores agregados citados até **~23** | Embrapa: componente arbóreo acumula ~8 t C/ha/ano (≈29 tCO2); manchetes de "até 23 tCO2e/ha/ano" incluem biomassa, não só solo. Usar a faixa baixa como default conservador. |

**Cautelas obrigatórias (devem aparecer no produto):**

- **tC vs tCO2e:** muitos números de Embrapa estão em **carbono elementar (tC)**. Multiplicar por
  **3,67** para obter tCO2e. Confundir os dois infla o resultado em ~3,7×.
- **Carbono do solo satura:** o ganho de SOC é maior nos primeiros anos e tende a **platô após
  ~20 anos** (premissa do IPCC 2006). Em solos muito degradados há um **limiar de 3–5 anos** antes de
  ganho mensurável.
- **Horizonte creditável:** tipicamente **~10 a 30 anos** (crediting period). Após a saturação, novos
  créditos cessam, mesmo que o estoque se mantenha (e exige **permanência** — risco de reversão).
- **Não permanência / reversão:** SOC pode ser perdido rapidamente se o manejo regredir; daí os
  buffers (10–20% dos créditos) exigidos pelas metodologias.
- **Referência conservadora geral (Cerrado/plantio direto):** FAO cita **0,3–1,15 t C/ha/ano** para
  conversão a plantio direto — lembrete de que faixas baixas são comuns e devem ancorar o "min".

---

## 4. Metano entérico e pecuária

- A pecuária bovina emite **metano entérico (CH4)** pela fermentação ruminal — o maior componente da
  pegada de carbono do rebanho. CH4 tem GWP ~27–28 (AR5/AR6, 100 anos).
- A **intensificação/melhoria da produtividade reduz a intensidade de emissão** (kg CO2e por kg de
  carcaça produzida), mesmo que a emissão absoluta por animal possa subir. Estudos da Embrapa
  Pecuária Sudeste (São Carlos/SP): animais abatidos por volta de **19 meses** em pastagem intensiva
  tiveram **menor intensidade de emissão (kg CO2e/kg carcaça)** que sistemas extensivos, além de
  exigir **menos área** para a mesma produção.
- **Implicação para o motor:** o carbono "vendável" da pecuária a pasto vem majoritariamente do
  **sequestro no solo (e biomassa, em ILPF)**, não da redução de metano por si. A redução de
  intensidade de metano é um co-benefício/argumento de eficiência, raramente o crédito principal num
  projeto de pré-viabilidade. Tratar metano como **fator de emissão a descontar** do balanço, não
  como fonte de crédito.

---

## 5. Metodologias aplicáveis (famílias — não recomendação definitiva)

| Família | Padrão | O que cobre / o que exige |
|---|---|---|
| **VM0032** — Adoption of Sustainable Grasslands (fire & grazing) | Verra / VCS | Pastagens degradadas via ajuste de fogo e pastejo. Em atualização pela Verra (consolidando metodologias de grassland). Exige estratificação, modelagem e/ou amostragem de solo. |
| **VM0042** — Improved Agricultural Land Management (IALM) | Verra / VCS | Manejo agrícola melhorado (fertilização, plantio direto, cobertura, **manejo de pastejo**). Três rotas: (i) *measure-and-model* (amostragem + modelos RothC/CENTURY/DNDC), (ii) *measure-and-re-measure* (só amostragem repetida), (iii) fatores de emissão default (IPCC). Exige amostragem de SOC, MRV robusto e avaliação de incerteza. |
| **Soil carbon / SOC methodologies** (genérico) | Verra, Gold Standard, outras | Quantificação de mudança de estoque de SOC; sempre exigem linha de base, estratificação, amostragem laboratorial, modelagem, buffer de permanência. |
| **ARR — Afforestation, Reforestation & Revegetation** | Verra (ex. VM0047, AR-ACM/AR-AMS), Gold Standard A/R | Para **áreas abertas** (pasto degradado → floresta/SAF). Crédito pela **biomassa arbórea** (não só solo). Exige demonstração de que a área estava sem floresta na linha de base, monitoramento de crescimento, buffer. Aplicável a recomposição de **excedente/voluntária**, não a passivo obrigatório. |

Notas transversais: todas exigem (a) **adicionalidade**, (b) **linha de base** crível, (c) **MRV**
(monitoramento, relato, verificação) com custo fixo alto, (d) **buffer de não permanência**, (e)
ausência de **dupla contagem**. Projetos pequenos costumam só viabilizar via **agregação/grouped
projects**.

---

## 6. Preço de crédito no mercado voluntário (faixas; alta volatilidade)

> Fonte principal: Ecosystem Marketplace SOVCM 2025, Sylvera, Regreener (2024–2025). Câmbio de
> referência usado: **USD 1 ≈ BRL 5,4** (jun/2026; ajustar). Mercado **muito volátil** — preços
> dependem de qualidade (rating), vintage, co-benefícios e tipo (remoção > redução).

| Tipo de crédito | Faixa USD/tCO2e | Faixa BRL/tCO2e (aprox.) | Observações |
|---|---|---|---|
| **Solo / agropecuário** (regen ag, SOC) | ~**6 a 15** (transações premium europeias €49–60 são exceção) | ~**30 a 80** | Costuma valer **menos** e sofre desconto por incerteza de mensuração e risco de permanência. Média projetos agrícolas ~US$ 7–9 em mercados emergentes. |
| **ARR / florestal (nature-based removal)** | ~**5 a 25** (metade do ARR); BBB+ ~**26**; alguns > **50** | ~**27 a 135** (premium até ~270) | Remoções florestais comandam prêmio (em 2024 remoções ~+381% sobre reduções). Faixa ampla por qualidade. |
| **Referência mercado geral** | alta qualidade A–AAA ~**14,8**; baixa CCC–B ~**3,5**; média paga ~**6,1** | ~**19 a 80** | Mostra a dispersão por rating. |
| **Brasil (estimativas locais)** | ~**10 a 30** | citado **R$ 26,5** (média) até **R$ 50–150**; alta qualidade nacional < R$ 50 | Grande dispersão; usar com cautela. |

**Mensagem para o motor:** usar **solo < florestal**; apresentar sempre faixa min/típico/max e um
*disclaimer* de volatilidade. Não usar preço europeu de mercado regulado (€80–150) como referência
para projeto voluntário brasileiro de solo.

---

## 7. Tabela de parâmetros para o motor (DEFAULTS PRELIMINARES)

> **LABEL: DEFAULTS PRELIMINARES — calibrar antes de produção.** Valores em **tCO2e/ha/ano** e
> **BRL/tCO2e**. Câmbio assumido USD≈BRL 5,4. "Área mínima viável" reflete custo fixo de MRV/validação
> e necessidade de agregação; é heurística, não regra de padrão.

| Rota | Sequestro tCO2e/ha/ano (min / típico / max) | Horizonte (anos) | Preço BRL/tCO2e (min / típico / max) | Área mínima viável (ha) |
|---|---|---|---|---|
| Recuperação de pastagem degradada (SOC) | 1,0 / 3,0 / 4,4 | 10–20 | 30 / 55 / 80 | ~500 (ou via agregação) |
| Pastejo rotacionado / intensificação (SOC) | 1,0 / 2,0 / 3,5 | 10–20 | 30 / 55 / 80 | ~500 (ou via agregação) |
| ILPF / integração lavoura-pecuária-floresta | 5,0 / 9,0 / 15,0 | 15–30 | 40 / 90 / 135 | ~300–500 |
| ARR / reflorestamento de área aberta (excedente/voluntária) | 8,0 / 15,0 / 25,0 | 20–30 | 30 / 90 / 150 | ~300–500 |

Notas:
- Faixas de pastagem ancoradas em Embrapa (≤3,5 tCO2e/ha "balanço positivo"; até 4,4 tC/ha em casos —
  já convertendo e arredondando conservadoramente) e FAO (0,3–1,15 tC/ha como piso).
- ILPF/ARR incluem **biomassa**, por isso faixas maiores; aplicar buffer de permanência (10–20%).
- Preços herdam a dispersão da seção 6; solo deliberadamente abaixo de florestal.
- **Sempre descontar** buffer de não permanência e custos de MRV no cálculo líquido.

---

## 8. Regras / contexto regional por bioma (pecuária)

- **Cerrado:** maior área de pastagem do país (~54 Mha) e **baixo estoque de SOC** de base → maior
  *potencial relativo* de ganho ao recuperar. Estoque médio citado: ~38,8 tCO2e/ha (0–5 cm) e
  ~169,5 tCO2e/ha (0–30 cm). RL = **20%** fora da Amazônia Legal, **35%** se em área de cerrado dentro
  da Amazônia Legal. Foco prioritário do Programa ABC para recuperação de pastagem (Centro-Oeste).
- **Amazônia (Legal):** RL = **80%** em floresta — restringe muito a área de pasto "legal" e eleva o
  risco regulatório/reputacional; passivo de desmatamento frequente → cuidado redobrado com
  adicionalidade e elegibilidade. Pastagem em área desmatada ilegalmente é **inelegível**.
- **Pampa (Sul):** campo nativo é o bioma; "recuperar pastagem" pode conflitar com conservação de
  campo nativo (converter campo nativo em pasto plantado pode ser **perda** de carbono/biodiversidade,
  não ganho). RL = **20%**. Tratar projetos de Pampa com cautela específica — manejo conservacionista
  de campo nativo (ajuste de pastejo/fogo, estilo VM0032) é mais coerente que "intensificação".
- **Mata Atlântica:** lei de proteção mais restritiva (Lei 11.428/2006) sobre supressão de vegetação;
  RL = 20%, mas elegibilidade de conversão é muito limitada. Bom para ARR/restauração de excedente.
- **Caatinga / Pantanal:** RL = 20%; dinâmicas próprias (semiárido / pulso de inundação) que alteram
  fortemente taxas de SOC — não usar defaults de Cerrado nesses biomas sem ajuste.

---

## Fontes

**Legislação**
- Lei 12.651/2012 (Código Florestal) — Planalto: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm
- Lei 15.042/2024 (SBCE — mercado regulado) — Planalto: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15042.htm
- Art. 4º (APP) — Jusbrasil: https://www.jusbrasil.com.br/topicos/26441393/artigo-4-da-lei-n-12651-de-25-de-maio-de-2012
- Art. 61-A (áreas consolidadas em APP) — Cidadania Ambiental: https://cidadaniaambiental.com.br/artigo-61-a-do-novo-codigo-florestal-regras-para-recomposicao-de-app-em-areas-rurais-consolidadas/
- Áreas rurais consolidadas em APP — Embrapa Código Florestal: https://www.embrapa.br/en/codigo-florestal/entenda-o-codigo-florestal/area-de-preservacao-permanente/areas-rurais-consolidadas-em-app
- Topo de morro — CPT / Lei 12.651: https://www.cpt.com.br/codigo-florestal/novo-codigo-florestal-brasileiro-morros-montes-montanhas-e-serras-e-apps

**Reserva Legal e CRA**
- Área de Reserva Legal — Embrapa: https://www.embrapa.br/en/codigo-florestal/area-de-reserva-legal-arl
- Compensação de RL por bioma (STF) — Martinez Associados: https://www.martinezassociados.com/post/compensacao-ambiental-stf-confirma-compensacao-de-reserva-legal-por-bioma
- Cotas de Reserva Ambiental (CRA) — FEBRABAN/CSU: https://cmsarquivos.febraban.org.br/Arquivos/documentos/PDF/Cotas%20de%20Reserva%20Ambiental.pdf
- O que são CRAs — ((o))eco: https://oeco.org.br/dicionario-ambiental/28921-o-que-sao-cotas-de-reserva-ambiental-cras/

**Adicionalidade / mercado regulado**
- Adicionalidade: critério de integridade — Conjur: https://www.conjur.com.br/2025-abr-21/adicionalidade-criterio-de-integridade-ambiental-no-mercado-de-credito-de-carbono/
- Monetizar RL e APP? — Portal do Agronegócio: https://www.portaldoagronegocio.com.br/economia/mercado-financeiro/artigos/creditos-de-carbono-no-campo-e-possivel-monetizar-a-reserva-legal-e-app
- Lei 15.042 — análise Demarest: https://www.demarest.com.br/wp-content/uploads/2025/03/DEMAREST-Mercado-de-Carbono-no-Brasil-%E2%80%93-Lei-no-15.042.pdf
- Exclusão do agro do SBCE — Conjur: https://www.conjur.com.br/2025-jan-28/nova-regulacao-do-mercado-de-carbono-perspectivas-e-impactos-da-lei-15-042-24/

**Carbono no solo / pastagem / ILPF (Embrapa, IPCC, FAO)**
- Manejo de pastagens recupera carbono — Embrapa: https://www.embrapa.br/en/busca-de-noticias/-/noticia/83489361/manejo-correto-de-pastagens-pode-recuperar-carbono-perdido-na-mudanca-de-uso-da-terra
- Pecuária gera crédito com média lotação — Embrapa: https://www.embrapa.br/en/busca-de-noticias/-/noticia/63282137/pecuaria-e-capaz-de-gerar-credito-de-carbono-com-media-lotacao-no-pasto
- Capacidade de sequestro de CO2 em pastagens produtivas (Cerrado) — Embrapa: https://www.embrapa.br/en/busca-de-publicacoes/-/publicacao/903133/capacidade-de-sequestro-de-co2-em-pastagens-produtivas-no-bioma-cerrado
- ILPF — árvores acumulam 8 t C/ha/ano — Embrapa: https://www.embrapa.br/tema-integracao-lavoura-pecuaria-floresta-ilpf/busca-de-noticias/-/noticia/61253931/arvores-em-sistemas-integrados-acumulam-8-t-de-carbono-por-hectare-a-cada-ano
- ILPF até 23 tCO2e/ha/ano — Canal Rural: https://planetacampo.canalrural.com.br/ilp/ilpf-pode-sequestrar-23-toneladas-de-co2-equivalente-por-ha-ano/
- Soil carbon sequestration (FAO World Soil Resources 96): https://openknowledge.fao.org/server/api/core/bitstreams/7f745787-9e3d-476c-9120-1c9ea9a8b6d7/content
- Managing expectations (saturação/grazing) — Springer Climatic Change: https://link.springer.com/article/10.1007/s10584-020-02673-x

**Metano entérico**
- Pasture intensification affects methane emission intensity — Oxford J Animal Science: https://academic.oup.com/jas/article/98/10/skaa309/5905786
- Intensified pasture systems (Atlantic Forest) — MDPI Agronomy: https://www.mdpi.com/2073-4395/12/11/2738

**Metodologias**
- VM0042 IALM v2.2 — Verra: https://verra.org/methodologies/vm0042-improved-agricultural-land-management-v2-2/
- Consolidação de metodologias de grassland (VM0032) — Viresco: https://virescosolutions.com/verra-consolidates-sustainable-grassland-methodologies/

**Preços**
- State of the Voluntary Carbon Market 2025 — Ecosystem Marketplace: https://3298623.fs1.hubspotusercontent-na1.net/hubfs/3298623/SOVCM%202025/Ecosystem%20Marketplace%20State%20of%20the%20Voluntary%20Carbon%20Market%202025.pdf
- VCM update — Regreener: https://www.regreener.earth/blog/voluntary-carbon-market-update
- Sylvera State of Carbon Credits 2025: https://www.sylvera.com/blog/sylvera-state-of-carbon-credits-2025-market-shifts-from-volume-to-value
- Crédito de carbono no agro 2025 — Aegro: https://aegro.com.br/blog/credito-de-carbono-2025/

**ARR e área mínima**
- Cost-effective restoration across Brazil's biomes — ScienceDirect: https://www.sciencedirect.com/science/article/abs/pii/S0048969723012160
- Carbon finance for smallholders (área mínima/agregação) — CPI: https://www.climatepolicyinitiative.org/can-carbon-finance-work-for-smallholder-agriculture/
