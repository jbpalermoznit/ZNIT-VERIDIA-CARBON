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

/** Ilustração principal do hero — mockup do card de análise da VeridIA. */
export function IllustrationHero({ className }: Props) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 460 380" className={className} role="img" aria-label="VeridIA analisando uma propriedade rural">
      <defs>
        <clipPath id="mapClip">
          <rect x="40" y="92" width="208" height="178" rx="14" />
        </clipPath>
      </defs>

      {/* halos de profundidade */}
      <circle cx="240" cy="190" r="172" fill="#ffffff" opacity="0.10" />
      <circle cx="240" cy="190" r="120" fill="#ffffff" opacity="0.08" />

      {/* satélite + feixe de análise */}
      <g transform="translate(316 28)">
        <line x1="22" y1="34" x2="-150" y2="70" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="4 6" />
        <rect x="10" y="0" width="38" height="24" rx="6" fill="#ffffff" />
        <rect x="2" y="6" width="10" height="12" rx="2" fill={TEAL} />
        <rect x="46" y="6" width="10" height="12" rx="2" fill={TEAL} />
        <rect x="20" y="24" width="18" height="12" rx="3" fill={TEAL_300} />
      </g>

      {/* sombra + card principal */}
      <rect x="34" y="68" width="392" height="248" rx="24" fill={INK} opacity="0.10" />
      <rect x="28" y="58" width="392" height="248" rx="24" fill="#ffffff" />

      {/* barrinha de topo do card */}
      <circle cx="52" cy="82" r="5" fill={TEAL} />
      <rect x="64" y="78" width="120" height="8" rx="4" fill={TEAL_100} />

      {/* MAPA com talhões */}
      <g>
        <rect x="40" y="92" width="208" height="178" rx="14" fill={TEAL_100} />
        <g clipPath="url(#mapClip)">
          <path d="M40 150 L130 110 L248 140 L248 270 L40 270 Z" fill={TEAL_300} />
          <path d="M40 92 L150 92 L120 180 L40 200 Z" fill={TEAL} opacity="0.45" />
          <path d="M150 92 L248 92 L248 150 L150 170 Z" fill={TEAL} opacity="0.30" />
          <path d="M70 270 L150 200 L248 240 L248 270 Z" fill={TEAL} opacity="0.55" />
          {/* contorno da propriedade (tracejado) */}
          <path d="M74 132 L186 116 L216 196 L120 232 Z" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="7 6" />
        </g>
        {/* pino */}
        <g transform="translate(150 168)">
          <path d="M0 0 C 10 -16, 10 -28, 0 -34 C -10 -28, -10 -16, 0 0 Z" fill={INK} />
          <circle cx="0" cy="-22" r="5" fill="#ffffff" />
        </g>
        {/* chip flutuante */}
        <g transform="translate(150 248)">
          <rect x="-58" y="-13" width="116" height="26" rx="13" fill="#ffffff" />
          <circle cx="-42" cy="0" r="5" fill={TEAL} />
          <text x="-30" y="4" fontSize="12" fontWeight="700" fill={INK}>Potencial alto</text>
        </g>
      </g>

      {/* PAINEL direito — score + linhas */}
      <g transform="translate(266 92)">
        <rect x="0" y="0" width="138" height="178" rx="14" fill={TEAL_100} opacity="0.55" />
        {/* score */}
        <g transform="translate(69 64)">
          <circle r={r} fill="none" stroke="#ffffff" strokeWidth="9" />
          <circle r={r} fill="none" stroke={TEAL} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${c * 0.78} ${c}`} transform="rotate(-90)" />
          <text textAnchor="middle" y="2" fontSize="22" fontWeight="700" fill={INK}>78</text>
          <text textAnchor="middle" y="18" fontSize="9" fill={TEAL}>de 100</text>
        </g>
        {/* linhas de resultado */}
        <g transform="translate(20 116)">
          <circle cx="3" cy="3" r="3.5" fill={TEAL} />
          <rect x="14" y="0" width="86" height="7" rx="3.5" fill={TEAL} opacity="0.8" />
          <circle cx="3" cy="22" r="3.5" fill={TEAL_300} />
          <rect x="14" y="19" width="70" height="7" rx="3.5" fill={TEAL_300} />
          <circle cx="3" cy="44" r="3.5" fill={TEAL_300} />
          <rect x="14" y="41" width="78" height="7" rx="3.5" fill={TEAL_300} />
        </g>
      </g>
    </svg>
  );
}
