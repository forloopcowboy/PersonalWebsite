import { Logo } from "@personal/ui";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hello World" },
    { name: "description", content: "Personal website" },
  ];
}

const TAGS = ["NX", "Vite", "React Router", "pnpm", "SSR"];

const TAG_STYLES = [
  { bg: "#ff6b6b", shadow: "rgba(255,68,68,0.33)" },
  { bg: "#ffd93d", shadow: "rgba(255,187,0,0.33)" },
  { bg: "#6bcb77", shadow: "rgba(68,170,85,0.33)" },
  { bg: "#4d96ff", shadow: "rgba(17,102,255,0.33)" },
  { bg: "#c77dff", shadow: "rgba(153,51,255,0.33)" },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-[linear-gradient(135deg,#0f0c29,#302b63,#24243e)] p-8 font-sans">
      <div className="flex flex-col items-center gap-4">
        <Logo className="h-24 w-24 drop-shadow-[0_0_30px_rgba(77,150,255,0.45)]" />
        <div className="bg-[linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#c77dff)] bg-clip-text text-[clamp(3.5rem,10vw,7rem)] font-black leading-none tracking-[-0.03em] text-transparent drop-shadow-[0_0_40px_rgba(77,150,255,0.4)]">
          Hello, World
        </div>
        <p className="text-[clamp(0.95rem,2.5vw,1.2rem)] font-light uppercase tracking-[0.12em] text-white/55">
          your new personal website
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-[0.6rem]">
        {TAGS.map((tag, i) => (
          <span
            key={tag}
            className="rounded-full px-[1.1rem] py-[0.4rem] text-[0.8rem] font-bold tracking-[0.06em] text-white shadow-[0_4px_20px_var(--tag-shadow)]"
            style={
              {
                backgroundColor: TAG_STYLES[i % TAG_STYLES.length].bg,
                "--tag-shadow": TAG_STYLES[i % TAG_STYLES.length].shadow,
              } as React.CSSProperties
            }
          >
            {tag}
          </span>
        ))}
      </div>
    </main>
  );
}
