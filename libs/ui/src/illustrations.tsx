import type { SVGProps } from 'react';

type IllustrationProps = SVGProps<SVGSVGElement>;

export function HeroDecoration(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 480 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="380"
        cy="80"
        r="60"
        className="fill-teal/[.18] delay-100 duration-1000"
      />
      <circle
        cx="400"
        cy="100"
        r="40"
        className="fill-ember/[.22] delay-200 duration-200"
      />
      <rect
        x="60"
        y="180"
        width="90"
        height="90"
        rx="18"
        className="fill-teal/[.12] delay-300 duration-1000"
        transform="rotate(-12 60 180)"
      />
      <rect
        x="320"
        y="200"
        width="70"
        height="70"
        rx="14"
        className="fill-peach/[.2] delay-200 duration-200"
        transform="rotate(8 320 200)"
      />
      <circle
        cx="160"
        cy="60"
        r="28"
        className="animate-pulse fill-ember/[.15] delay-100 duration-1000"
      />
      <circle
        cx="240"
        cy="260"
        r="36"
        className="fill-teal/[.14] delay-200 duration-200"
      />
      <polygon
        points="200,30 220,70 180,70"
        className="fill-wood/[.13] delay-300 duration-1000"
        transform="rotate(15 200 50)"
      />
      <rect
        x="430"
        y="160"
        width="30"
        height="80"
        rx="8"
        className="fill-teal/[.1]"
        transform="rotate(20 445 200)"
      />
      <circle
        cx="100"
        cy="130"
        r="14"
        className="fill-peach/[.2] delay-150 duration-1000"
      />
      <polygon
        points="350,280 380,300 320,300"
        className="fill-ember/[.12] delay-100 duration-1000"
      />
    </svg>
  );
}

export function IllustrationNSide(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Capsule pill — left half */}
      <rect
        x="28"
        y="55"
        width="25"
        height="45"
        rx="12.5"
        className="fill-teal/[.35]"
      />
      {/* Capsule pill — right half */}
      <rect
        x="53"
        y="55"
        width="25"
        height="45"
        rx="12.5"
        className="fill-ember/[.3]"
      />
      {/* Capsule band */}
      <rect x="48" y="55" width="10" height="45" className="fill-peach/[.15]" />

      {/* Round tablet */}
      <circle cx="110" cy="120" r="14" className="fill-peach/[.25]" />
      <path
        d="M100 116 L120 124"
        className="stroke-wood/[.2]"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Small pills scattered */}
      <ellipse
        cx="42"
        cy="118"
        rx="8"
        ry="5"
        className="fill-teal/[.2]"
        transform="rotate(30 42 118)"
      />
      <ellipse
        cx="78"
        cy="135"
        rx="7"
        ry="4.5"
        className="fill-ember/[.2]"
        transform="rotate(-15 78 135)"
      />

      {/* Syringe body */}
      <rect
        x="140"
        y="38"
        width="14"
        height="60"
        rx="3"
        className="fill-teal/[.2]"
      />
      {/* Syringe barrel lines */}
      <rect
        x="143"
        y="48"
        width="8"
        height="1.5"
        rx="0.75"
        className="fill-ink-soft/[.25]"
      />
      <rect
        x="143"
        y="56"
        width="8"
        height="1.5"
        rx="0.75"
        className="fill-ink-soft/[.2]"
      />
      <rect
        x="143"
        y="64"
        width="8"
        height="1.5"
        rx="0.75"
        className="fill-ink-soft/[.25]"
      />
      <rect
        x="143"
        y="72"
        width="8"
        height="1.5"
        rx="0.75"
        className="fill-ink-soft/[.2]"
      />
      {/* Syringe plunger */}
      <rect
        x="145"
        y="22"
        width="4"
        height="20"
        rx="2"
        className="fill-wood/[.3]"
      />
      <rect
        x="141"
        y="20"
        width="12"
        height="5"
        rx="2.5"
        className="fill-wood/[.25]"
      />
      {/* Syringe needle */}
      <rect
        x="146"
        y="98"
        width="2"
        height="18"
        rx="1"
        className="fill-ink-soft/[.3]"
      />
      {/* Syringe liquid fill */}
      <rect
        x="143"
        y="72"
        width="8"
        height="22"
        rx="2"
        className="fill-teal/[.15]"
      />

      {/* Chart panel */}
      <rect
        x="170"
        y="50"
        width="55"
        height="50"
        rx="6"
        className="fill-ink-soft/[.1]"
      />
      <path
        d="M180 85 L190 72 L200 78 L210 62 L215 70"
        className="stroke-ember/[.4]"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chart dots */}
      <circle cx="190" cy="72" r="2" className="fill-ember/[.5]" />
      <circle cx="210" cy="62" r="2" className="fill-ember/[.5]" />

      {/* Medical cross */}
      <rect
        x="185"
        y="112"
        width="16"
        height="5"
        rx="2.5"
        className="fill-teal/[.3]"
      />
      <rect
        x="190.5"
        y="106.5"
        width="5"
        height="16"
        rx="2.5"
        className="fill-teal/[.3]"
      />

      {/* Accent dots */}
      <circle cx="100" cy="40" r="4" className="fill-peach/[.2]" />
      <circle cx="130" cy="140" r="3" className="fill-teal/[.15]" />
    </svg>
  );
}

export function IllustrationTris(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="120" cy="80" r="50" className="fill-teal/[.2]" />
      <circle
        cx="120"
        cy="80"
        r="38"
        className="stroke-wood/[.3]"
        strokeWidth="1.5"
      />
      <ellipse
        cx="120"
        cy="80"
        rx="50"
        ry="20"
        className="stroke-ink-soft/[.2]"
        strokeWidth="1"
      />
      <ellipse
        cx="120"
        cy="80"
        rx="20"
        ry="50"
        className="stroke-ink-soft/[.15]"
        strokeWidth="1"
      />
      <path
        d="M80 55 C85 45, 95 40, 100 38"
        className="stroke-ember/[.5]"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M95 35 L100 38 L92 42" className="fill-ember/[.5]" />
      <path
        d="M75 95 Q80 85 78 70"
        className="stroke-ember/[.4]"
        strokeWidth="1.5"
      />
      <ellipse
        cx="73"
        cy="67"
        rx="4"
        ry="6"
        className="fill-teal/[.5]"
        transform="rotate(-20 73 67)"
      />
      <ellipse
        cx="78"
        cy="62"
        rx="3"
        ry="5"
        className="fill-teal/[.4]"
        transform="rotate(-30 78 62)"
      />
      <ellipse
        cx="82"
        cy="58"
        rx="3.5"
        ry="5"
        className="fill-teal/[.45]"
        transform="rotate(-10 82 58)"
      />
      <circle cx="50" cy="120" r="8" className="fill-peach/[.25]" />
      <circle cx="190" cy="40" r="6" className="fill-ember/[.2]" />
      <rect
        x="170"
        y="110"
        width="40"
        height="25"
        rx="5"
        className="fill-ink-soft/[.1]"
      />
      <rect
        x="175"
        y="118"
        width="30"
        height="2"
        rx="1"
        className="fill-peach/[.3]"
      />
      <rect
        x="175"
        y="124"
        width="20"
        height="2"
        rx="1"
        className="fill-peach/[.2]"
      />
    </svg>
  );
}

export function IllustrationPayflip(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="50"
        y="45"
        width="120"
        height="75"
        rx="10"
        className="fill-ink-soft/[.15]"
      />
      <rect
        x="55"
        y="50"
        width="110"
        height="65"
        rx="8"
        className="fill-peach/[.2]"
      />
      <rect
        x="65"
        y="62"
        width="40"
        height="6"
        rx="3"
        className="fill-ember/[.4]"
      />
      <rect
        x="65"
        y="74"
        width="60"
        height="4"
        rx="2"
        className="fill-wood/[.2]"
      />
      <rect
        x="65"
        y="84"
        width="30"
        height="4"
        rx="2"
        className="fill-wood/[.15]"
      />
      <circle cx="140" cy="95" r="10" className="fill-teal/[.4]" />
      <path d="M137 95 L140 92 L143 95 L140 98 Z" className="fill-ink-soft/[.3]" />
      <circle cx="185" cy="65" r="18" className="fill-ember/[.25]" />
      <circle cx="195" cy="75" r="18" className="fill-teal/[.2]" />
      <path
        d="M182 60 L182 70 M178 65 L186 65"
        className="stroke-ink-soft/[.3]"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="30"
        y="120"
        width="50"
        height="8"
        rx="4"
        className="fill-teal/[.15]"
      />
      <rect
        x="90"
        y="120"
        width="30"
        height="8"
        rx="4"
        className="fill-peach/[.15]"
      />
      <rect
        x="130"
        y="120"
        width="70"
        height="8"
        rx="4"
        className="fill-ember/[.12]"
      />
    </svg>
  );
}

export function IllustrationRecolonizer(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="90"
        y="40"
        width="60"
        height="80"
        rx="6"
        className="fill-ink-soft/[.2]"
      />
      <rect
        x="95"
        y="35"
        width="50"
        height="12"
        rx="3"
        className="fill-wood/[.25]"
      />
      <rect
        x="100"
        y="55"
        width="8"
        height="10"
        rx="2"
        className="fill-teal/[.4]"
      />
      <rect
        x="116"
        y="55"
        width="8"
        height="10"
        rx="2"
        className="fill-teal/[.4]"
      />
      <rect
        x="132"
        y="55"
        width="8"
        height="10"
        rx="2"
        className="fill-teal/[.4]"
      />
      <rect
        x="100"
        y="72"
        width="8"
        height="10"
        rx="2"
        className="fill-peach/[.35]"
      />
      <rect
        x="116"
        y="72"
        width="8"
        height="10"
        rx="2"
        className="fill-peach/[.35]"
      />
      <rect
        x="132"
        y="72"
        width="8"
        height="10"
        rx="2"
        className="fill-peach/[.35]"
      />
      <rect
        x="108"
        y="95"
        width="24"
        height="25"
        rx="4"
        className="fill-ember/[.3]"
      />
      <polygon points="120,20 135,35 105,35" className="fill-ember/[.3]" />
      <circle cx="45" cy="100" r="12" className="fill-teal/[.2]" />
      <circle cx="195" cy="90" r="10" className="fill-peach/[.2]" />
      <path
        d="M30 140 L60 140 L60 130 L80 130 L80 140 L160 140 L160 130 L180 130 L180 140 L210 140"
        className="stroke-wood/[.2]"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IllustrationGlutton(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="120" cy="95" rx="50" ry="30" className="fill-ember/[.25]" />
      <ellipse cx="120" cy="85" rx="50" ry="12" className="fill-peach/[.3]" />
      <ellipse cx="120" cy="80" rx="45" ry="8" className="fill-ember/[.15]" />
      <circle cx="105" cy="78" r="3" className="fill-teal/[.5]" />
      <circle cx="120" cy="76" r="2.5" className="fill-teal/[.4]" />
      <circle cx="135" cy="78" r="3" className="fill-teal/[.5]" />
      <circle cx="112" cy="73" r="2" className="fill-wood/[.3]" />
      <circle cx="128" cy="73" r="2" className="fill-wood/[.3]" />
      <path
        d="M90 55 Q105 35 120 40 Q135 35 150 55"
        className="stroke-ember/[.3]"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="30"
        y="40"
        width="50"
        height="35"
        rx="8"
        className="fill-ink-soft/[.12]"
      />
      <circle cx="45" cy="52" r="6" className="fill-teal/[.25]" />
      <circle cx="65" cy="52" r="6" className="fill-peach/[.25]" />
      <rect
        x="38"
        y="62"
        width="24"
        height="3"
        rx="1.5"
        className="fill-wood/[.2]"
      />
      <circle cx="190" cy="60" r="14" className="fill-teal/[.15]" />
      <polygon
        points="190,48 198,56 195,66 185,66 182,56"
        className="stroke-ink-soft/[.2]"
        strokeWidth="1"
      />
    </svg>
  );
}

export function IllustrationCowboyInvestor(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M80 60 Q90 30 120 35 Q150 30 160 60 L155 60 Q148 45 120 42 Q92 45 85 60 Z"
        className="fill-wood/[.3]"
      />
      <rect
        x="95"
        y="55"
        width="50"
        height="8"
        rx="4"
        className="fill-wood/[.25]"
      />
      <rect
        x="50"
        y="80"
        width="140"
        height="55"
        rx="8"
        className="fill-ink-soft/[.12]"
      />
      <path
        d="M70 120 L90 95 L110 110 L130 88 L150 105 L170 85"
        className="stroke-teal/[.5]"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 120 L90 100 L110 112 L130 92 L150 108 L170 88 L170 130 L70 130 Z"
        className="fill-teal/[.08]"
      />
      <circle cx="170" cy="85" r="4" className="fill-ember/[.5]" />
      <rect
        x="70"
        y="128"
        width="100"
        height="2"
        rx="1"
        className="fill-wood/[.2]"
      />
      <circle cx="205" cy="50" r="12" className="fill-peach/[.2]" />
      <circle cx="35" cy="110" r="8" className="fill-ember/[.15]" />
      <path
        d="M195 95 L210 95 M202 88 L202 102"
        className="stroke-ember/[.3]"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IllustrationThisWebsite(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Background circle — site/globe */}
      <circle cx="120" cy="80" r="45" className="fill-teal/[.12]" />
      <circle
        cx="120"
        cy="80"
        r="34"
        className="stroke-wood/[.2]"
        strokeWidth="1"
        strokeDasharray="4 3"
      />

      {/* Left curly brace */}
      <path
        d="M88 52 Q95 52 97 58 L97 72 Q97 78 92 80 Q97 82 97 88 L97 102 Q95 108 88 108"
        className="stroke-ember/[.45]"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right curly brace */}
      <path
        d="M152 52 Q145 52 143 58 L143 72 Q143 78 148 80 Q143 82 143 88 L143 102 Q145 108 152 108"
        className="stroke-ember/[.45]"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cowboy hat */}
      <path
        d="M108 72 Q112 62 120 64 Q128 62 132 72 L130 72 Q127 66 120 67 Q113 66 110 72 Z"
        className="fill-wood/[.35]"
      />
      <rect
        x="110"
        y="70"
        width="20"
        height="3"
        rx="1.5"
        className="fill-wood/[.3]"
      />

      {/* Code lines inside braces */}
      <rect
        x="108"
        y="80"
        width="18"
        height="2"
        rx="1"
        className="fill-teal/[.4]"
      />
      <rect
        x="112"
        y="86"
        width="12"
        height="2"
        rx="1"
        className="fill-peach/[.35]"
      />
      <rect
        x="110"
        y="92"
        width="15"
        height="2"
        rx="1"
        className="fill-teal/[.3]"
      />

      {/* Browser chrome — top left */}
      <rect
        x="22"
        y="28"
        width="55"
        height="38"
        rx="5"
        className="fill-ink-soft/[.1]"
      />
      <circle cx="33" cy="36" r="2" className="fill-ember/[.35]" />
      <circle cx="41" cy="36" r="2" className="fill-peach/[.3]" />
      <circle cx="49" cy="36" r="2" className="fill-teal/[.35]" />
      <rect
        x="28"
        y="44"
        width="35"
        height="2"
        rx="1"
        className="fill-wood/[.2]"
      />
      <rect
        x="28"
        y="50"
        width="24"
        height="2"
        rx="1"
        className="fill-wood/[.15]"
      />
      <rect
        x="28"
        y="56"
        width="30"
        height="2"
        rx="1"
        className="fill-wood/[.12]"
      />

      {/* MDX file icon — bottom right */}
      <rect
        x="175"
        y="95"
        width="40"
        height="35"
        rx="4"
        className="fill-ink-soft/[.1]"
      />
      <rect
        x="181"
        y="105"
        width="20"
        height="2"
        rx="1"
        className="fill-teal/[.3]"
      />
      <rect
        x="181"
        y="111"
        width="28"
        height="2"
        rx="1"
        className="fill-peach/[.25]"
      />
      <rect
        x="181"
        y="117"
        width="16"
        height="2"
        rx="1"
        className="fill-teal/[.2]"
      />

      {/* Accent dots */}
      <circle cx="42" cy="120" r="6" className="fill-peach/[.2]" />
      <circle cx="195" cy="45" r="8" className="fill-ember/[.15]" />
      <circle cx="180" cy="30" r="4" className="fill-teal/[.2]" />
    </svg>
  );
}

export function IllustrationNotFound(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="160" cy="120" r="70" className="fill-teal/[.12]" />
      <circle
        cx="160"
        cy="120"
        r="50"
        className="stroke-wood/[.2]"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      <path
        d="M160 80 L160 125"
        className="stroke-ember/[.5]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="160" cy="75" r="5" className="fill-ember/[.4]" />
      <path
        d="M160 125 L180 110"
        className="stroke-ink-soft/[.3]"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M120 170 Q130 160 140 165 Q150 170 160 160 Q170 170 180 165 Q190 160 200 170"
        className="stroke-peach/[.3]"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="80" cy="70" r="8" className="fill-peach/[.2]" />
      <circle cx="240" cy="80" r="10" className="fill-ember/[.15]" />
      <circle cx="60" cy="170" r="6" className="fill-teal/[.2]" />
      <rect
        x="220"
        y="150"
        width="40"
        height="30"
        rx="6"
        className="fill-teal/[.18]"
      />
      <text
        x="160"
        y="205"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="18"
        className="fill-wood/[.4]"
      >
        ?
      </text>
    </svg>
  );
}
