"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { useSubmission } from "@/lib/useSubmission";
import { saveAccount, loadAccount, weakHash } from "@/lib/account";
import { analysisPath } from "@/lib/flow";

export function SignupGate({ id }: { id: string }) {
  const router = useRouter();
  const { submission, loading, flush } = useSubmission(id);
  const [mode, setMode] = useState<"signup" | "login">("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  // Já cadastrado nesta análise → segue direto para a conversa.
  useEffect(() => {
    if (!loading && submission?.lead) router.replace(analysisPath(id));
  }, [loading, submission?.lead, id, router]);

  // Prefill a partir de conta local salva.
  useEffect(() => {
    const acc = loadAccount();
    if (acc) {
      setMode("login");
      setEmail(acc.email);
      setName(acc.name);
    }
  }, []);

  function proceed() {
    if (!submission) return;
    const now = new Date().toISOString();

    if (mode === "login") {
      const acc = loadAccount();
      if (!acc || acc.email.toLowerCase() !== email.trim().toLowerCase()) {
        setError("Não encontramos essa conta. Crie uma para começar.");
        setMode("signup");
        return;
      }
      if (acc.passKey && acc.passKey !== weakHash(pass)) {
        setError("Senha incorreta.");
        return;
      }
      flush({ ...submission, lead: { name: acc.name, email: acc.email, phone: acc.phone, createdAt: now } });
      router.push(analysisPath(id));
      return;
    }

    // signup
    if (name.trim().length < 2 || !/.+@.+\..+/.test(email) || pass.length < 4) {
      setError("Preencha nome, um e-mail válido e uma senha (mín. 4 caracteres).");
      return;
    }
    const lead = { name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, createdAt: now };
    saveAccount({ ...lead, passKey: weakHash(pass) });
    flush({ ...submission, lead });
    router.push(analysisPath(id));
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-ink-500">Abrindo...</div>;
  }

  const isLogin = mode === "login";

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Lado da marca */}
      <div className="brand-mesh relative hidden flex-col justify-between p-10 text-white md:flex">
        <Link href="/" className="text-2xl"><Wordmark tone="light" /></Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Descubra quanto a sua terra pode gerar em créditos de carbono.
          </h2>
          <p className="mt-4 max-w-sm text-white/85">
            Crie sua conta para começar a análise. Leva poucos minutos e o
            diagnóstico é gratuito.
          </p>
        </div>
        <ul className="space-y-2 text-sm text-white/85">
          <li>· Análise da sua propriedade por satélite</li>
          <li>· Estimativa de receita com créditos de carbono</li>
          <li>· Relatório e próximos passos</li>
        </ul>
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      </div>

      {/* Formulário */}
      <div className="flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="md:hidden">
            <Link href="/" className="text-2xl"><Wordmark /></Link>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink-900">
            {isLogin ? "Entrar na VeridIA" : "Criar sua conta"}
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {isLogin
              ? "Bom te ver de novo. Acesse para continuar."
              : "Comece grátis. Seus dados ficam protegidos e não são compartilhados."}
          </p>

          <div className="mt-6 space-y-3">
            {!isLogin && (
              <Field label="Nome" value={name} onChange={setName} placeholder="Seu nome" />
            )}
            <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" />
            {!isLogin && (
              <Field label="WhatsApp (opcional)" value={phone} onChange={setPhone} placeholder="(00) 00000-0000" />
            )}
            <Field label="Senha" type="password" value={pass} onChange={setPass} placeholder="••••••••" />
          </div>

          {error && <p className="mt-3 text-sm text-critico">{error}</p>}

          <Button className="mt-5 w-full" onClick={proceed}>
            {isLogin ? "Entrar e continuar" : "Criar conta e começar"}
          </Button>

          <p className="mt-4 text-center text-sm text-ink-500">
            {isLogin ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => { setError(""); setMode(isLogin ? "signup" : "login"); }}
              className="font-semibold text-brand-600 hover:underline"
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </p>

          <p className="mt-6 text-center text-xs text-ink-400">
            Ao continuar, você concorda em ser contatado pela VeridIA sobre a sua
            análise.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border-2 border-ink-300/60 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
      />
    </label>
  );
}
