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
      "Quando il gruppo non riesce a mettersi d'accordo su niente, Random lo fa per voi. Veloce, casuale, inappellabile.",
    eyebrow: "Lascia decidere il caso",
    icon: Dices,
    accentClassName:
      "from-sky-200/65 via-cyan-100/45 to-transparent shadow-sky-200/40",
  },
  {
    href: "/games",
    title: "Games",
    description:
      "Obbligo o Verità, la bottiglia, TAB-WHO?, la ruota, le sfide ose. Ogni gioco e gia carico, gia configurato, gia pronto. Voi dovete solo sedervi e iniziare a giocare.",
    eyebrow: "La serata vera inizia qui",
    icon: Gamepad2,
    accentClassName:
      "from-indigo-200/55 via-fuchsia-100/40 to-transparent shadow-indigo-200/36",
  },
  {
    href: "/tools",
    title: "Tools",
    description:
      "Timer, convertitori, note al volo. Tutto quello che serve durante una serata senza aprire mille app diverse e perdere il filo.",
    eyebrow: "Piccoli strumenti, grandi comodità",
    icon: TimerReset,
    accentClassName:
      "from-emerald-200/58 via-cyan-100/40 to-transparent shadow-emerald-200/36",
  },
];

export const homeHighlights = [
  {
    title: "Niente più 'boh, non so'",
    description:
      "Quante serate sono finite ancora prima di iniziare, bloccate su 'ma cosa facciamo?'. Choiser taglia quel momento. In dieci secondi avete una direzione - un gioco, una scelta, un'idea. La serata puo finalmente iniziare.",
    icon: Sparkles,
  },
  {
    title: "Si ride. Si gioca. Si resta.",
    description:
      "Non stiamo parlando di passare il tempo davanti a uno schermo. Ogni gioco in Choiser e pensato per farvi guardare negli occhi, ridere, scoprire qualcosa di nuovo l'uno dell'altro. Quello schermo serve solo per darvi il la - poi ci pensate voi.",
    icon: Joystick,
  },
  {
    title: "Tutto dove ti aspetti",
    description:
      "Non serve spiegare niente a nessuno. Non servono account, download o tutorial. Apri il link, scegli da dove partire, inizia. Choiser e pensato per funzionare nel tempo tra un bicchiere e l'altro.",
    icon: Compass,
  },
];

export const adviceLeadIns = [
  "Oggi potrebbe essere il giorno giusto per...",
  "Un'idea per rompere la routine:",
  "Se vuoi cambiare ritmo, prova questo:",
  "Piccolo cambio, grande effetto:",
  "Stasera prova qualcosa di diverso:",
];

export const randomActivities = [
  "Esci a fotografare qualcosa che non avevi mai notato prima.",
  "Chiama una persona con cui non parli da tempo e chiedile come sta davvero.",
  "Prova una ricetta nuova usando solo quello che hai gia in casa.",
  "Concediti una passeggiata senza meta per venti minuti, senza notifiche.",
  "Scrivi tre idee che rimandi da troppo tempo e scegline una da iniziare oggi.",
  "Vai a prendere un caffe in un posto che non hai mai provato.",
  "Leggi finalmente quell'articolo lungo o quel capitolo salvato da giorni.",
  "Dedica mezz'ora a un hobby che continui a prometterti di riprendere.",
  "Fai una piccola sorpresa a qualcuno con un messaggio gentile o inaspettato.",
  "Svuota una sola zona della stanza e trasformala in un angolo che ti piace.",
  "Metti una playlist nuova e sistema qualcosa che di solito ignori.",
  "Impara una micro-abilita con un tutorial breve e applicala subito.",
  "Esci di casa con l'idea di osservare, non di correre.",
  "Prepara una cena semplice ma curata come se fosse un piccolo evento.",
  "Spegni tutto per un'ora e concentrati su una sola cosa che conta.",
  "Fai un mini workout di dieci minuti solo per cambiare energia alla giornata.",
  "Scopri un artista, un podcast o una canzone che non conoscevi.",
  "Scrivi una lista di cose che vorresti fare questo mese, poi scegline una.",
  "Vai in un posto della tua citta in cui non metti piede da troppo tempo.",
  "Riorganizza il weekend intorno a una sola attivita che ti fa stare bene.",
  "Concediti un'ora offline senza sentirti in ritardo su niente.",
  "Apri un libro, una rivista o una newsletter e leggila senza multitasking.",
  "Prova qualcosa che non hai mai fatto questa settimana, anche in piccolo.",
  "Fai una domanda interessante a qualcuno invece di iniziare la solita conversazione.",
];

export const instantAnswers = [
  // Positive
  "Le stelle sono allineate. Vai.",
  "Tutto indica di sì.",
  "La risposta è già dentro di te - ed è sì.",
  "L'universo ha già deciso per te.",
  "Senza dubbio alcuno.",
  "Meglio di così non poteva andare.",
  "Il momento è questo. Non aspettare.",
  "Ogni segno dice che è il momento giusto.",
  "Più che probabile. Quasi certo.",
  "Fidati. Funzionerà.",
  "Il futuro ti sorride su questo.",
  "La risposta è scritta nel vento - ed è sì.",
  "Tutte le strade portano nella stessa direzione.",
  "Conta su di esso.",
  "Favorevole. Molto favorevole.",
  "Chi non risica non rosica - e tu vincerai.",

  // Negative
  "Le ombre parlano chiaro: no.",
  "Difficilmente. Molto difficilmente.",
  "Le forze cosmiche sono contrarie.",
  "Non è il tuo momento - non ancora.",
  "Meglio non insistere.",
  "La risposta che cerchi non è quella che vuoi sentire.",
  "Tutto parla contro questa idea.",
  "Lascia perdere, almeno per ora.",
  "Il dado è tratto - e non è in tuo favore.",
  "La nebbia avvolge questo cammino. Fermati.",
  "Non ci contare.",
  "Chiedilo di nuovo quando sei pronto/a ad accettare un no.",
  "Le acque sono agitate. Non attraversare.",
  "Questa porta è chiusa. Cerca un'altra.",
  "Il tuo istinto lo sa già - e anche lui dice no.",
  "Richiede riflessione. Molta riflessione.",

  // Ambiguous
  "Dipende da quanto ci tieni davvero.",
  "Forse. Ma dipende dalla domanda che stai davvero facendo.",
  "Le nebbie del futuro non sono ancora diradate.",
  "La risposta cambia ogni volta che respiri.",
  "Chiedilo ancora. Con più coraggio.",
  "Né sì né no - ma qualcosa nel mezzo che vale di più.",
  "Il futuro è nebbioso. Riprova domani.",
  "La palla non risponde - risponde solo chi fa la domanda.",
  "Tutto è possibile. Non tutto è consigliabile.",
  "Il tempo dirà quello che io non posso ancora dirti.",
  "Forse oggi no. Forse domani sì.",
  "La risposta è nella domanda. Rileggila.",
  "L'universo sta ancora decidendo.",
  "Tienilo sospeso ancora un po'.",
  "Né buono né cattivo - semplicemente prematuro.",
  "Il destino non si sbilancia su questo.",
  "La verità dipende da chi guarda.",
  "Questa risposta te la devi guadagnare.",
];

export const timerPresets = [15, 30, 45, 60, 90, 120, 180];
