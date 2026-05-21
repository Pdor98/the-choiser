import {
  EditorialCTAButton,
  EditorialFooter,
  EditorialSectionHeader,
} from "@/components/layout/editorial-elements";
import {
  AnimatedCard,
  AnimatedSection,
  ScrollHero,
  StaggerContainer,
} from "@/components/layout/motion-system";
import { PageExitBar } from "@/components/layout/page-exit-bar";
import { Card } from "@/components/ui/card";
import { DailyAdvicePanel } from "@/components/home/daily-advice-panel";
import { HomeHeroPanel } from "@/components/home/home-hero-panel";
import { HomeScrollSpotlight } from "@/components/home/home-scroll-spotlight";
import { categories, homeHighlights } from "@/lib/site-content";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-10 sm:space-y-24 lg:space-y-28">
      <ScrollHero
        glowClassName="bg-cyan-300/18"
        className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[#0a0a0a] px-5 py-20 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-8 sm:py-24 lg:px-12 lg:py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,44,84,0.46),transparent_34%),radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_58%),linear-gradient(180deg,rgba(10,10,10,0.22),rgba(10,10,10,0.8))]" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-400/14 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-60 w-60 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl sm:h-84 sm:w-84" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="editorial-reveal text-[11px] font-medium uppercase tracking-[0.36em] text-slate-400 sm:text-xs">
            Choiser
          </p>
          <h1 className="editorial-reveal editorial-reveal-delay-1 font-heading mx-auto mt-6 max-w-4xl text-balance text-[clamp(3.4rem,8vw,4.7rem)] font-bold tracking-[-0.04em] text-slate-50">
            Perché le serate migliori non si pianificano. Si innescano.
          </h1>
          <p className="editorial-reveal editorial-reveal-delay-2 mx-auto mt-6 max-w-[38rem] text-balance text-[1.05rem] leading-8 text-slate-400 sm:text-[1.18rem]">
            Choiser è nato per quei momenti in cui siete tutti insieme, nessuno
            ha voglia di decidere e la serata rischia di non decollare mai.
            Giochi, scelte rapide, strumenti utili: tutto pronto, tutto
            gratis, tutto in un posto solo.
          </p>
          <div className="editorial-reveal editorial-reveal-delay-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EditorialCTAButton href="/games">
              <span>Entra in Games</span>
            </EditorialCTAButton>
            <EditorialCTAButton href="/random" variant="secondary">
              <span>Apri Random</span>
            </EditorialCTAButton>
          </div>
        </div>
      </ScrollHero>

      <HomeScrollSpotlight />

      <AnimatedSection className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Cosa vuoi fare stasera?"
          description="Che siate in due o in dieci, indecisi o carichi, Choiser ha sempre qualcosa pronto per voi."
        />

        <StaggerContainer className="grid gap-5 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <AnimatedCard
                key={category.href}
                className="h-full"
              >
                <a
                  href={category.href}
                  className="group relative block h-full overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,17,29,0.96),rgba(14,24,40,0.92))] p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.9)] transition duration-300 hover:-translate-y-1 hover:border-white/16 hover:bg-[linear-gradient(180deg,rgba(11,20,34,0.98),rgba(15,27,46,0.94))]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-100">
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-slate-500">
                      {category.eyebrow}
                    </p>
                    <h2 className="mt-3 font-heading text-2xl font-semibold text-slate-50">
                      {category.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </a>
              </AnimatedCard>
            );
          })}
        </StaggerContainer>
      </AnimatedSection>

      <AnimatedSection className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Fatto per stare insieme. Nato da una serata tra amici."
          description="Choiser è nato da una domanda semplice: perché ogni volta che siamo in gruppo, l'unica cosa su cui non riusciamo a metterci d'accordo è cosa fare? Questa pagina è la risposta. Un posto per smettere di discutere e iniziare a divertirsi."
        />

        <StaggerContainer className="grid gap-5 md:grid-cols-3">
          {homeHighlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <AnimatedCard
                key={highlight.title}
                className="h-full"
              >
                <Card className="h-full p-6">
                  <div className="flex h-full flex-col">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-50">
                      {highlight.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {highlight.description}
                    </p>
                  </div>
                </Card>
              </AnimatedCard>
            );
          })}
        </StaggerContainer>
      </AnimatedSection>

      <AnimatedSection className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(8,12,20,0.96),rgba(11,17,29,0.94))] px-5 py-14 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-8 sm:py-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,126,247,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_40%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Manifesto
          </p>
          <h2 className="font-heading mx-auto mt-6 max-w-3xl text-balance text-[clamp(2.2rem,5vw,3.6rem)] font-semibold tracking-[-0.04em] text-slate-50">
            Choiser non è un&apos;app. È una scusa per stare insieme meglio.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-balance text-base leading-8 text-slate-300 sm:text-lg">
            L&apos;abbiamo costruito perché ci sembrava assurdo che, con tutto
            quello che esiste online, non ci fosse un posto semplice, immediato
            e fatto apposta per una serata tra amici. Non un social, non un
            gioco da scaricare, non qualcosa da spiegare. Solo uno spazio in
            cui arrivate in cinque, aprite Choiser e la serata prende forma da
            sola.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-sm italic leading-7 text-slate-400 sm:text-base">
            C&apos;è un momento preciso in ogni serata in cui tutto potrebbe
            andare in mille direzioni diverse. Choiser esiste per trasformare
            quel momento in qualcosa di bello.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Inizia subito"
          description="Se vuoi entrare direttamente nel flusso, qui sotto trovi due ingressi rapidi: uno per farti suggerire un punto di partenza, uno per orientarti tra le sezioni con un colpo d'occhio."
        />

        <StaggerContainer className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <AnimatedCard className="h-full">
            <DailyAdvicePanel />
          </AnimatedCard>
          <AnimatedCard className="h-full">
            <HomeHeroPanel />
          </AnimatedCard>
        </StaggerContainer>
      </AnimatedSection>

      <AnimatedSection>
        <EditorialFooter />
      </AnimatedSection>

      <AnimatedSection>
        <PageExitBar
          title="Stasera avete già tutto quello che serve. Mancava solo il posto giusto da cui partire."
          description="Nessun account. Nessun download. Solo voi, uno schermo e una serata da vivere."
        />
      </AnimatedSection>
    </div>
  );
}
