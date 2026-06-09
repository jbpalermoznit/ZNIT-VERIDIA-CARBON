/**
 * Ilustrações inline (SVG) da VeridIA — geométricas, minimalistas, na paleta da
 * marca. Sem dependências e sem assets externos.
 */

const TEAL = "#56B7A5";
const TEAL_300 = "#A9D7CD";
const TEAL_100 = "#E6F3EE";
const INK = "#1c1c1e";

type Props = { className?: string };

/** Satélite analisando a poligonal de uma propriedade. */
export function IllustrationDiagnostico({ className }: Props) {
  return (
    <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Análise por satélite">
      <rect x="20" y="60" width="200" height="100" rx="12" fill={TEAL_100} />
      <path d="M48 120 L96 84 L150 110 L196 78 L196 150 L48 150 Z" fill={TEAL_300} opacity="0.7" />
      <path d="M70 150 L110 118 L150 138 L196 104 L196 150 Z" fill={TEAL} opacity="0.55" />
      <path d="M86 92 L132 78 L168 104 L120 124 Z" fill="none" stroke={TEAL} strokeWidth="2.5" strokeDasharray="5 5" />
      <circle cx="128" cy="100" r="5" fill={INK} />
      {/* satélite */}
      <g transform="translate(150 18)">
        <rect x="14" y="6" width="20" height="14" rx="3" fill={INK} />
        <rect x="-2" y="9" width="14" height="8" rx="2" fill={TEAL} />
        <rect x="36" y="9" width="14" height="8" rx="2" fill={TEAL} />
        <line x1="24" y1="20" x2="24" y2="40" stroke={TEAL} strokeWidth="2" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

/** Mostrador de score de prontidão. */
export function IllustrationScore({ className }: Props) {
  const r = 64;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Score de prontidão">
      <g transform="translate(120 95)">
        <circle r={r} fill="none" stroke={TEAL_100} strokeWidth="16" />
        <circle
          r={r}
          fill="none"
          stroke={TEAL}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${c * 0.78} ${c}`}
          transform="rotate(-90)"
        />
        <text textAnchor="middle" y="-2" fontSize="38" fontWeight="700" fill={INK}>78</text>
        <text textAnchor="middle" y="22" fontSize="13" fill={TEAL}>de 100</text>
      </g>
    </svg>
  );
}

/** Carbono que vira renda — folha + moeda + seta de crescimento. */
export function IllustrationRenda({ className }: Props) {
  return (
    <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Carbono que vira renda">
      <rect x="36" y="120" width="28" height="40" rx="4" fill={TEAL_300} />
      <rect x="76" y="96" width="28" height="64" rx="4" fill={TEAL} opacity="0.7" />
      <rect x="116" y="66" width="28" height="94" rx="4" fill={TEAL} />
      <path d="M44 78 L96 62 L150 40" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M150 40 l-14 2 l6 -13 Z" fill={INK} />
      {/* moeda com folha */}
      <g transform="translate(176 96)">
        <circle r="30" fill={TEAL_100} stroke={TEAL} strokeWidth="3" />
        <path d="M0 -14 C 12 -10, 14 6, 0 16 C -14 6, -12 -10, 0 -14 Z" fill={TEAL} />
        <line x1="0" y1="16" x2="0" y2="-10" stroke={TEAL_100} strokeWidth="2" />
      </g>
    </svg>
  );
}

/** Conversa/estratégia com especialista. */
export function IllustrationEstrategia({ className }: Props) {
  return (
    <svg viewBox="0 0 240 180" className={className} role="img" aria-label="Estratégia com especialista">
      <rect x="34" y="44" width="120" height="80" rx="12" fill={TEAL_100} />
      <line x1="52" y1="68" x2="136" y2="68" stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
      <line x1="52" y1="86" x2="120" y2="86" stroke={TEAL_300} strokeWidth="5" strokeLinecap="round" />
      <line x1="52" y1="104" x2="128" y2="104" stroke={TEAL_300} strokeWidth="5" strokeLinecap="round" />
      <path d="M70 124 L70 142 L92 124 Z" fill={TEAL_100} />
      <circle cx="178" cy="96" r="26" fill={TEAL} />
      <circle cx="178" cy="86" r="9" fill={TEAL_100} />
      <path d="M162 116 C 164 100, 192 100, 194 116 Z" fill={TEAL_100} />
    </svg>
  );
}

/** Ilustração principal do hero — fazenda vista de cima + satélite + dado. */
export function IllustrationHero({ className }: Props) {
  return (
    <svg viewBox="0 0 420 320" className={className} role="img" aria-label="VeridIA analisando uma propriedade rural">
      <defs>
        <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <circle cx="210" cy="160" r="150" fill="url(#vsky)" />
      {/* terreno / talhões */}
      <g transform="translate(60 150)">
        <path d="M0 60 L120 0 L300 40 L300 150 L0 150 Z" fill="#ffffff" opacity="0.16" />
        <path d="M0 60 L120 0 L200 18 L70 90 Z" fill="#ffffff" opacity="0.22" />
        <path d="M70 90 L200 18 L300 40 L150 120 Z" fill="#ffffff" opacity="0.12" />
        <path d="M30 40 L150 -12" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 6" fill="none" />
        <circle cx="150" cy="55" r="7" fill="#ffffff" />
        <circle cx="150" cy="55" r="14" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" />
      </g>
      {/* satélite */}
      <g transform="translate(300 40)">
        <rect x="18" y="0" width="34" height="22" rx="5" fill="#ffffff" />
        <rect x="-8" y="4" width="22" height="14" rx="3" fill={TEAL_300} />
        <rect x="56" y="4" width="22" height="14" rx="3" fill={TEAL_300} />
        <line x1="35" y1="22" x2="35" y2="70" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="5 5" />
      </g>
      {/* cartão de score flutuante */}
      <g transform="translate(250 200)">
        <rect width="120" height="74" rx="14" fill="#ffffff" />
        <circle cx="30" cy="37" r="20" fill="none" stroke={TEAL_100} strokeWidth="6" />
        <circle cx="30" cy="37" r="20" fill="none" stroke={TEAL} strokeWidth="6" strokeLinecap="round" strokeDasharray="98 130" transform="rotate(-90 30 37)" />
        <text x="30" y="42" textAnchor="middle" fontSize="16" fontWeight="700" fill={INK}>78</text>
        <rect x="60" y="24" width="48" height="7" rx="3.5" fill={TEAL} />
        <rect x="60" y="38" width="40" height="6" rx="3" fill={TEAL_300} />
        <rect x="60" y="50" width="44" height="6" rx="3" fill={TEAL_300} />
      </g>
    </svg>
  );
}
