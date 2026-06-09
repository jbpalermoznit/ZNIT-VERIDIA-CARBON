import { Wordmark, ByZnit } from "@/components/ui/Wordmark";
import { StartButton } from "@/components/landing/StartButton";
import { ResumeLink } from "@/components/landing/ResumeLink";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="brand-mesh relative overflow-hidden text-white">
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-8">
          <nav className="flex items-center justify-between">
            <div className="text-2xl">
              <Wordmark tone="light" />
            </div>
            <ByZnit tone="light" />
          </nav>

          <div className="mx-auto mt-20 max-w-3xl text-center">
            <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
              Pecuária a pasto · o que você já faz pode virar renda
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">
              Seu pasto pode render mais do que você imagina.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">
              Converse alguns minutos com a VeridIA. Ela cruza o satélite com os
              dados da sua fazenda, diagnostica o potencial da sua pastagem e
              aponta onde recuperar o pasto pode virar uma nova renda — sem
              trabalho extra, sem jargão.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="rounded-full bg-white p-1">
                <StartButton />
              </div>
              <span className="text-sm text-white/80">
                É uma conversa de 8 a 12 minutos · você pode sair e voltar quando quiser
              </span>
              <ResumeLink tone="light" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />
      </section>

      {/* O que a VeridIA faz */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-ink-900">
          O papel da VeridIA
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-700">
          A VeridIA não te dá mais um projeto pra tocar. Ela olha o pasto que
          você já tem e traduz isso em oportunidade de negócio.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Step n="1" title="Diagnostica o pasto" text="Cruza o satélite e o histórico da fazenda pra ver o estado real da sua pastagem." />
          <Step n="2" title="Encontra a oportunidade" text="Mostra onde recuperar o pasto e melhorar o manejo pode gerar carbono e renda." />
          <Step n="3" title="Conecta à monetização" text="Indica como o carbono do solo e a produção melhor podem virar receita." />
          <Step n="4" title="Orienta a estratégia" text="Aponta como estruturar, posicionar e levar a oportunidade adiante." />
        </div>
      </section>

      {/* Sustentabilidade que já faz parte do dia a dia */}
      <section className="bg-brand-100">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-ink-900">
            Você já cuida do seu pasto. Talvez só não esteja lucrando com isso.
          </h2>
          <p className="mt-4 text-ink-700">
            Recuperar pastagem degradada, melhorar o manejo, fazer rodízio: o que
            você já faz no campo prende carbono no solo e pode virar um ativo. A
            VeridIA mostra esse valor e como ele pode virar retorno financeiro —
            sem mudar toda a sua operação.
          </p>
          <div className="mt-8">
            <StartButton size="md" children="Ver o potencial do meu pasto" />
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-300/40 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 text-center">
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

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="card p-6">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 font-bold text-white">
        {n}
      </span>
      <h3 className="mt-4 font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-700">{text}</p>
    </div>
  );
}
