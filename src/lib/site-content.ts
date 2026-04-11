import type { LucideIcon } from "lucide-react";
import {
  House,
  Dices,
  Gamepad2,
  TimerReset,
  Sparkles,
  Joystick,
  Compass,
} from "lucide-react";

export type Category = {
  href: "/random" | "/games" | "/tools";
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type NavigationLink = {
  href: "/" | "/random" | "/games" | "/tools";
  label: string;
  headerTitle: string;
  icon: LucideIcon;
};

export const navigationLinks: NavigationLink[] = [
  {
    href: "/",
    label: "Home",
    headerTitle: "Choiser",
    icon: House,
  },
  {
    href: "/random",
    label: "Random",
    headerTitle: "Random",
    icon: Dices,
  },
  {
    href: "/games",
    label: "Games",
    headerTitle: "Games",
    icon: Gamepad2,
  },
  {
    href: "/tools",
    label: "Tools",
    headerTitle: "Tools",
    icon: TimerReset,
  },
];

export function getActiveNavigation(pathname: string) {
  return (
    navigationLinks.find((link) =>
      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href),
    ) ?? navigationLinks[0]
  );
}

export const categories: Category[] = [
  {
    href: "/random",
    title: "Random",
    description:
      "Generatori smart per rompere l'indecisione con un risultato immediato e visivamente coinvolgente.",
    eyebrow: "Scelte rapide",
    icon: Dices,
    accentClassName:
      "from-sky-200/65 via-cyan-100/45 to-transparent shadow-sky-200/40",
  },
  {
    href: "/games",
    title: "Games",
    description:
      "Mini esperienze leggere, reattive e divertenti per giocare quando vuoi staccare un attimo.",
    eyebrow: "Giochi veloci",
    icon: Gamepad2,
    accentClassName:
      "from-indigo-200/55 via-fuchsia-100/40 to-transparent shadow-indigo-200/36",
  },
  {
    href: "/tools",
    title: "Tools",
    description:
      "Utility essenziali con un'interfaccia pulita, pensate per essere utili davvero anche su mobile.",
    eyebrow: "Strumenti utili",
    icon: TimerReset,
    accentClassName:
      "from-emerald-200/58 via-cyan-100/40 to-transparent shadow-emerald-200/36",
  },
];

export const homeHighlights = [
  {
    title: "Decisioni più veloci",
    description:
      "Riduci l'attrito iniziale con generatori rapidi e micro-esperienze pensate per agire subito.",
    icon: Sparkles,
  },
  {
    title: "Esperienza giocosa",
    description:
      "Interazioni animate, feedback chiari e un tono leggero rendono ogni sezione piacevole da usare.",
    icon: Joystick,
  },
  {
    title: "Navigazione semplice",
    description:
      "Categorie ben separate e componenti riusabili mantengono l'app scalabile e facile da estendere.",
    icon: Compass,
  },
];

export const randomActivities = [
  "Fai una passeggiata di 20 minuti con il telefono in tasca.",
  "Prova una ricetta nuova usando solo quello che hai già in casa.",
  "Metti una playlist chill e riordina una piccola zona della stanza.",
  "Scrivi tre idee che rimandi da troppo tempo.",
  "Vai a prendere un caffè in un posto che non conosci ancora.",
  "Leggi un capitolo di un libro o un articolo lungo salvato da giorni.",
  "Chiama una persona con cui non parli da un po'.",
  "Guarda un film che avevi messo in watchlist.",
  "Fai un mini workout da 10 minuti.",
  "Esci a fotografare qualcosa che ti incuriosisce.",
  "Dedica mezz'ora a un hobby che lasci spesso in pausa.",
  "Scegli un posto in città e vacci senza programmare troppo.",
  "Prepara una cena semplice ma fatta bene.",
  "Spegni le notifiche per un'ora e concentrati su una sola cosa.",
  "Impara qualcosa di nuovo con un video o un tutorial breve.",
  "Organizza il weekend con una sola attività davvero desiderata.",
  "Fai una lista di idee per il prossimo mese.",
  "Prenditi un'ora offline per ricaricarti davvero.",
  "Esplora una nuova canzone, artista o podcast.",
  "Concediti un momento lento senza sentirti in colpa.",
];

export const timerPresets = [15, 30, 45, 60, 90, 120, 180];
