import type { Metadata } from "next";
import { Wordmark, ByZnit } from "@/components/ui/Wordmark";
import { StartButton } from "@/components/landing/StartButton";
import { ResumeLink } from "@/components/landing/ResumeLink";
import {
  IllustrationHero,
  IllustrationDiagnostico,
  IllustrationScore,
  IllustrationRenda,
  IllustrationEstrategia,
} from "@/components/landing/illustrations";

export const metadata: Metadata = {
  title: "VeridIA — Potencial de carbono e renda da sua propriedade rural",
  description:
    "A VeridIA cruza satélite e dados públicos da sua propriedade e mostra, em minutos, se ela tem potencial para projetos de crédito de carbono e quanto isso pode render. Grátis, sem jargão. Uma plataforma ZNIT.",
  keywords: [
    "crédito de carbono",
    "mercado de carbono",
    "carbono no agro",
    "pré-viabilidade de carbono",
    "projeto de carbono rural",
    "pecuária sustentável",
    "recuperação de pastagem",
    "carbono no solo",
    "CAR",
    "renda no campo",
    "ZNIT",
    "VeridIA",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "VeridIA — Descubra o potencial de carbono e renda da sua terra",
    description:
      "Em minutos, sem custo: o potencial da sua propriedade para gerar crédito de carbono e renda.",
    type: "website",
    locale: "pt_BR",
    siteName: "VeridIA",
  },
};

const FAQ = [
  {
    q: "O que é a VeridIA?",
    a: "A VeridIA é uma plataforma da ZNIT que analisa a sua propriedade rural por satélite e dados públicos e mostra, em poucos minutos, se ela tem potencial para projetos de crédito de carbono — e quanto isso pode render.",
  },
  {
    q: "Preciso pagar para usar?",
    a: "O diagnóstico é gratuito. Você descobre o potencial da sua terra, o score de prontidão e as oportunidades sem custo. A análise econômica detalhada e o acompanhamento de um especialista são opcionais.",
  },
  {
    q: "O que é crédito de carbono no agro?",
    a: "É a remuneração por práticas que retiram carbono da atmosfera ou evitam emissões — como recuperar pastagem degradada, melhorar o manejo do solo ou preservar mata nativa. A VeridIA traduz isso sem jargão e mostra onde pode haver valor pra você.",
  },
  {
    q: "Que dados eu preciso ter em mãos?",
    a: "Basta o número do CAR (Cadastro Ambiental Rural). A VeridIA puxa a geometria da propriedade e o uso do solo automaticamente. Se você não tiver o número, dá pra buscar por CPF/CNPJ ou desenhar a área no mapa.",
  },
  {
    q: "A VeridIA garante que vou conseguir vender crédito?",
    a: "Não. A VeridIA é uma triagem preliminar: mostra se vale a pena avançar. Ela não substitui a análise técnica final, a validação por certificadora nem o parecer jurídico.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Sim. Seus dados são usados apenas para gerar a sua análise e, se você quiser, para falar com um especialista da VeridIA. Não são compartilhados.",
  },
];

export default function Landing() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "ZNIT",
        brand: "VeridIA",
        url: "https://znit-veridia-carbon.vercel.app",
        description:
          "Tecnologia de dados de sustentabilidade. VeridIA é a plataforma de pré-viabilidade de projetos de carbono no agro.",
      },
      {
        "@type": "SoftwareApplication",
        name: "VeridIA",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        description:
          "Pré-viabilidade de projetos de crédito de carbono para propriedades rurais brasileiras.",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== Hero ===== */}
      <section className="brand-mesh relative overflow-hidden text-white">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-8">
          <nav className="flex items-center justify-between">
            <div className="text-2xl">
              <Wordmark tone="light" />
            </div>
            <div className="hidden items-center gap-6 text-sm text-white/85 md:flex">
              <a href="#como-funciona" className="hover:text-white">Como funciona</a>
              <a href="#entrega" className="hover:text-white">O que você recebe</a>
              <a href="#faq" className="hover:text-white">Dúvidas</a>
              <ByZnit tone="light" />
            </div>
          </nav>

          <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
                Pré-viabilidade de projetos de carbono no agro
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl">
                Descubra o potencial de carbono e de renda da sua propriedade.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/90">
                A VeridIA cruza imagens de satélite e dados públicos da sua terra
                e mostra, em minutos, se ela tem potencial para gerar crédito de
                carbono — e quanto isso pode render. De graça e sem jargão.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <div className="rounded-full bg-white p-1">
                  <StartButton />
                </div>
                <span className="text-sm text-white/80">
                  Conversa de 8 a 12 minutos · só precisa do número do CAR · você pode sair e voltar
                </span>
                <ResumeLink tone="light" />
              </div>
            </div>
            <div className="hidden md:block">
              <IllustrationHero className="w-full" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />
      </section>

      {/* ===== O que você recebe ===== */}
      <section id="entrega" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead
          eyebrow="O que você recebe"
          title="Um diagnóstico claro do potencial da sua terra"
          subtitle="Sem consultor, sem custo e sem termo técnico. A VeridIA entrega o que importa pra você decidir."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Deliverable Illustration={IllustrationDiagnostico} title="Diagnóstico por satélite" text="A VeridIA lê o uso e a cobertura da sua terra a partir do CAR e de imagens de satélite." />
          <Deliverable Illustration={IllustrationScore} title="Score de prontidão" text="Uma nota de 0 a 100 que resume o quão pronta a propriedade está para um projeto de carbono." />
          <Deliverable Illustration={IllustrationRenda} title="Oportunidades de renda" text="Onde o que você já tem hoje pode virar crédito de carbono e gerar uma nova receita." />
          <Deliverable Illustration={IllustrationEstrategia} title="Próximos passos" text="Um caminho claro do que confirmar, dos documentos e de quando falar com um especialista." />
        </div>
      </section>

      {/* ===== Como funciona ===== */}
      <section id="como-funciona" className="bg-brand-100/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHead
            eyebrow="Como funciona"
            title="Quatro passos, uma conversa"
            subtitle="A VeridIA conduz como um bate-papo: uma pergunta de cada vez, e ela faz o trabalho pesado."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <Step n="1" title="Informe o CAR" text="Digite o número do CAR ou desenhe a área no mapa. A VeridIA puxa os dados públicos." />
            <Step n="2" title="A VeridIA analisa" text="Ela cruza satélite, bioma e histórico de uso pra entender a sua propriedade." />
            <Step n="3" title="Veja as oportunidades" text="Receba o score, as rotas mais aderentes e o que favorece o seu caso." />
            <Step n="4" title="Estimativa e estratégia" text="Veja a estimativa de receita e o melhor próximo passo pra avançar." />
          </div>
        </div>
      </section>

      {/* ===== Para quem é ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHead eyebrow="Para quem é" title="Feita para quem vive do campo" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Persona icon={<IconUser />} title="Produtor rural" text="Quer saber, sem complicação, se a terra tem potencial e se vale a pena avançar." />
          <Persona icon={<IconSprout />} title="Filho ou sucessor" text="Cuida da gestão da família e busca novas fontes de renda para a propriedade." />
          <Persona icon={<IconChart />} title="Consultor parceiro" text="Atende vários produtores e usa a VeridIA para uma triagem rápida e qualificada." />
        </div>
      </section>

      {/* ===== Inbound / educação (SEO) ===== */}
      <section className="bg-ink-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Carbono no agro, explicado simples
          </h2>
          <div className="mt-6 space-y-4 text-white/85">
            <p>
              O <strong>mercado de carbono</strong> remunera quem ajuda o planeta
              a emitir menos ou a retirar carbono da atmosfera. No campo, isso
              acontece o tempo todo: recuperar uma <strong>pastagem degradada</strong>,
              melhorar o <strong>manejo do solo</strong> ou manter a mata em pé
              prende carbono e pode virar um <strong>crédito de carbono</strong>.
            </p>
            <p>
              O problema é que avaliar esse potencial sempre foi caro e
              demorado. Consultorias cobram alto por um estudo de pré-viabilidade,
              e a maioria das propriedades nunca chega a ser avaliada. A VeridIA
              inverte isso: em minutos e sem custo, você descobre se a sua terra
              tem potencial — antes de gastar com qualquer estudo.
            </p>
            <p>
              A ideia não é te dar mais trabalho. É mostrar que a
              <strong> sustentabilidade que você já pratica</strong> pode virar
              receita, e te orientar sobre como estruturar, posicionar e levar
              essa oportunidade adiante.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Sustentabilidade que já existe ===== */}
      <section className="bg-brand-100">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
            Você já cuida bem da sua terra — e isso pode virar renda.
          </h2>
          <p className="mt-4 text-ink-700">
            Pastagem bem manejada, áreas recuperadas, mata preservada: muito do
            que você já faz é um ativo ambiental que pode gerar receita. A
            VeridIA revela esse valor e mostra como transformá-lo em renda — sem
            mudar toda a sua operação.
          </p>
          <div className="mt-8">
            <StartButton size="md" children="Descobrir o potencial da minha terra" />
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <SectionHead eyebrow="Dúvidas frequentes" title="Perguntas que todo produtor faz" />
        <div className="mt-8 divide-y divide-ink-300/40 rounded-2xl border border-ink-300/40">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-ink-900">
                {f.q}
                <span className="ml-4 text-brand-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== CTA final ===== */}
      <section className="brand-mesh text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Vale a pena avançar com a sua terra? Descubra agora.
          </h2>
          <p className="mt-3 text-white/90">É grátis e leva poucos minutos.</p>
          <div className="mt-8 flex justify-center">
            <div className="rounded-full bg-white p-1">
              <StartButton />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-300/40 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center">
          <Wordmark withTagline />
          <ByZnit />
          <p className="max-w-lg text-xs text-ink-500">
            A VeridIA é uma ferramenta de triagem preliminar. Não substitui
            análise técnica, validação por certificadora ou parecer jurídico.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-ink-700">{subtitle}</p>}
    </div>
  );
}

function Deliverable({
  Illustration,
  title,
  text,
}: {
  Illustration: React.FC<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-brand-100/50 px-4 pt-4">
        <Illustration className="mx-auto h-32 w-full" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-ink-900">{title}</h3>
        <p className="mt-2 text-sm text-ink-700">{text}</p>
      </div>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="relative rounded-2xl bg-white p-6 shadow-card">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 font-bold text-white">
        {n}
      </span>
      <h3 className="mt-4 font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-700">{text}</p>
    </div>
  );
}

function Persona({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card p-6">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-brand-600">
        {icon}
      </span>
      <h3 className="mt-3 font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-700">{text}</p>
    </div>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconSprout() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M12 21v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 14c0-3 2-5 5-5 0 3-2 5-5 5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 14c0-3-2-5-5-5 0 3 2 5 5 5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M4 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="8" y="11" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="7" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
