import { cn } from "@/lib/utils";

/** Avatar da VeridIA — marca geométrica simples em verde-água. */
export function VeridiaAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-sm",
        className,
      )}
      aria-hidden
    >
      V
    </span>
  );
}

/**
 * Bolha de fala da VeridIA. A VeridIA fala em primeira pessoa do produto.
 * Usada em todas as etapas para conduzir a conversa.
 */
export function VeridiaSays({
  children,
  className,
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-3", animate && "animate-fade-up", className)}>
      <VeridiaAvatar />
      <div className="rounded-2xl rounded-tl-sm bg-brand-100 px-4 py-3 text-ink-900">
        {children}
      </div>
    </div>
  );
}

/** Indicador "VeridIA está pensando..." */
export function VeridiaThinking({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 animate-fade-up">
      <VeridiaAvatar className="animate-pulse-soft" />
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-brand-100 px-4 py-3 text-ink-700">
        <span className="flex gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </span>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-500"
      style={{ animationDelay: delay }}
    />
  );
}

/** Resposta do usuário — bolha alinhada à direita. */
export function UserSays({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex animate-fade-up justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-ink-900 px-4 py-2.5 text-sm font-medium text-white">
        {children}
      </div>
    </div>
  );
}
