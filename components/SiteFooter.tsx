import Link from "next/link";
import { Crest } from "./Crest";
import { Container } from "./ui";
import { MAIN_NAV } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-brand-950 text-brand-100">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Crest className="h-11 w-11" />
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-white">
                PSMO College (Autonomous)
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
                Department of Computer Applications
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-100/80">
            Nurturing skilled software professionals through a modern BCA
            programme, active student associations and hands-on technical
            training.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100/70">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-100/90 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-100/70">
            Department Office
          </h3>
          <address className="mt-4 space-y-2.5 text-sm not-italic text-brand-100/90">
            <p>
              PSMO College (Autonomous)
              <br />
              Tirurangadi, Malappuram
              <br />
              Kerala, India
            </p>
          </address>
          <p className="mt-4 text-xs text-brand-100/60">
            Affiliated to University of Calicut · NAAC Accredited
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-brand-100/70 sm:flex-row">
          <span>
            © {new Date().getFullYear()} BCA Department, PSMO College. All
            rights reserved.
          </span>
          <span>Designed for BCA Students &amp; Faculty</span>
        </Container>
      </div>
    </footer>
  );
}
