import { type ComponentPropsWithoutRef, type ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type DivProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "className">;

function mergeClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Panel({ children, className, ...props }: BaseProps & DivProps) {
  return (
    <div {...props} className={mergeClassNames("rounded-3xl border border-white/5 bg-black/30 p-6", className)}>
      {children}
    </div>
  );
}

export function SectionEyebrow({ children, className }: BaseProps) {
  return <p className={mergeClassNames("text-xs uppercase tracking-[0.4em] text-white/50", className)}>{children}</p>;
}

export function DetailCard({ children, className }: BaseProps) {
  return <div className={mergeClassNames("rounded-2xl border border-white/10 p-4", className)}>{children}</div>;
}
