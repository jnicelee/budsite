import { forwardRef } from "react";
import { navigateTo } from "../lib/navigation";

export function SiteLink({ href, children, className = "", onClick }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(href);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

export function MemberLinkTitle({ link }) {
  if (link.id === "link-tournament-signups") {
    return (
      <>
        Tournament
        <span className="block whitespace-nowrap">Sign-Ups</span>
      </>
    );
  }

  return link.label;
}

export function Eyebrow({ children, light = false }) {
  return (
    <p className={`text-xs font-black uppercase tracking-[0.22em] ${light ? "text-white/75" : "text-[#CC0000]"}`}>
      {children}
    </p>
  );
}

export function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-7 max-w-3xl sm:mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 text-3xl font-black leading-[1.04] tracking-tight text-[#2D2926] sm:text-4xl md:text-6xl">
        {title}
      </h1>
      {children && <p className="mt-5 max-w-2xl text-base leading-7 text-[#5b5450] sm:text-lg sm:leading-8">{children}</p>}
    </div>
  );
}

export const Card = forwardRef(function Card({ children, className = "" }, ref) {
  return (
    <div ref={ref} className={`min-w-0 border border-[#ded8d2] bg-white p-4 shadow-[0_16px_45px_rgba(45,41,38,0.08)] sm:p-6 ${className}`}>
      {children}
    </div>
  );
});

export function PrimaryButton({ href, children, className = "" }) {
  return (
    <SiteLink
      href={href}
      className={`inline-flex items-center justify-center gap-2 bg-[#CC0000] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#A00000] ${className}`}
    >
      {children}
    </SiteLink>
  );
}

export function SecondaryButton({ href, children, className = "" }) {
  return (
    <SiteLink
      href={href}
      className={`inline-flex items-center justify-center gap-2 border border-[#2D2926]/20 bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#2D2926] ${className}`}
    >
      {children}
    </SiteLink>
  );
}

export function Page({ children, className = "" }) {
  return (
    <section className={`mx-auto min-h-[calc(100vh-4.75rem)] w-full max-w-[98rem] px-4 py-8 sm:px-5 sm:py-10 md:px-8 md:py-16 ${className}`}>
      {children}
    </section>
  );
}
