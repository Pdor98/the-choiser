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

export const adviceLeadIns = [
  "Oggi potrebbe essere il giorno giusto per...",
  "Un'idea per rompere la routine:",
  "Se vuoi cambiare ritmo, prova questo:",
  "Piccolo cambio, grande effetto:",
  "Per dare un tono diverso alla giornata:",
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
  "Si, e il momento giusto.",
  "Vai avanti senza paura.",
  "Puo funzionare meglio di quanto pensi.",
  "Ne vale la pena.",
  "Segui questa idea.",
  "C'e qualcosa di buono in questa direzione.",
  "La risposta tende al si.",
  "Si, ma resta leggero.",
  "Fallo con calma e vedrai.",
  "Questa scelta ha piu forza di quanto sembri.",
  "Il momento buono si sta aprendo.",
  "Prova: il rischio e minore di quanto temi.",
  "Sei piu pronto di quanto credi.",
  "Questa strada merita un tentativo.",
  "Accoglila: potrebbe sorprenderti.",
  "Le probabilita sono dalla tua parte.",
  "Un piccolo si basta per cominciare.",
  "Questa volta il segnale e favorevole.",
  "Vai, ma ascolta anche il ritmo.",
  "Si, soprattutto se non aspetti troppo.",
  "Non e il momento.",
  "Lascia perdere per ora.",
  "Meglio rimandare.",
  "Questa strada non porta lontano.",
  "Per adesso no.",
  "Non forzare cio che non si apre.",
  "Questa volta conviene lasciar scorrere.",
  "Non e la risposta che stai cercando.",
  "Fermati un passo prima.",
  "Questa intuizione va rivista.",
  "Ci sono troppe ombre attorno a questa scelta.",
  "Non oggi.",
  "Rischi di complicare piu del necessario.",
  "Se devi spingerla troppo, non fa per te.",
  "Per ora tienila chiusa.",
  "Non prendere questa direzione alla leggera.",
  "Non e il terreno migliore su cui muoverti.",
  "La risposta piu onesta, stavolta, e no.",
  "Riprova piu tardi.",
  "Non tutto e ancora chiaro.",
  "Aspetta un segnale.",
  "La risposta arrivera da sola.",
  "Concedi ancora un po di tempo alla domanda.",
  "Serve un dettaglio che ancora non vedi.",
  "Non decidere finche non senti piu silenzio dentro.",
  "Resta in ascolto.",
  "Non e tempo di conclusioni.",
  "Ci sono elementi ancora in movimento.",
  "Domani potresti leggerla diversamente.",
  "Lascia sedimentare.",
  "La nebbia non si e ancora alzata.",
  "Osserva meglio prima di scegliere.",
  "Non tutto va risolto subito.",
  "Fermati un attimo: manca ancora qualcosa.",
  "Raccogli un altro indizio.",
  "La risposta non ama la fretta.",
  "Apri una finestra e guarda fuori.",
  "Lascia che il caso decida un dettaglio.",
  "La risposta e gia dentro di te.",
  "Non cercare troppo lontano.",
  "Segui la porta che ti incuriosisce.",
  "Quello che cerchi potrebbe arrivare di lato.",
  "Guarda cio che continua a tornare.",
  "Una coincidenza puo dirti molto.",
  "Ascolta la prima intuizione, non la piu rumorosa.",
  "Il segnale arrivera in un momento quieto.",
  "La strada si rivelera un passo alla volta.",
  "Non ignorare l'eco di questa idea.",
  "La risposta si nasconde nel dettaglio piu semplice.",
  "Ogni pagina si apre quando smetti di forzarla.",
  "Forse devi cambiare luce, non domanda.",
  "Il punto non e capire tutto, ma sentire dove andare.",
  "Segui la curiosita prima della logica.",
  "Lascia una fessura aperta: li passa la risposta.",
  "Ogni risposta ha il suo tempo.",
  "Le scelte piu semplici sono spesso le migliori.",
  "Non tutto deve avere una risposta oggi.",
  "Quello che e vero non ha bisogno di urlare.",
  "A volte la direzione giusta si riconosce dalla pace.",
  "Le domande migliori maturano lentamente.",
  "Anche aspettare e una forma di decisione.",
  "Cio che conta resta, il resto si spegne.",
  "Se senti fretta, forse non e ancora il momento.",
  "La chiarezza ama le domande fatte bene.",
  "Le risposte profonde arrivano leggere.",
  "Una scelta buona non sempre fa rumore.",
  "Lascia che il tempo tolga quello che non serve.",
  "Non inseguire una risposta: renditi disponibile a riceverla.",
  "Le svolte migliori sembrano piccole all'inizio.",
  "La verita utile e quasi sempre sobria.",
  "Solo se hai dormito abbastanza.",
  "Non prima del caffe.",
  "Chiedilo di nuovo tra cinque minuti.",
  "Solo se ti senti coraggioso.",
  "Se devi chiedermelo due volte, forse lo sai gia.",
  "Funziona meglio dopo uno snack.",
  "Direi di si, ma non con quella faccia.",
  "Prima respira, poi chiedi ancora.",
  "Non e un no: e un 'forse fai ordine prima'.",
  "Se hai gia aperto tre tab, aspetta.",
  "Potrebbe essere brillante, oppure solo fame.",
  "La risposta migliora dopo una passeggiata.",
  "Se lo fai, fallo bene almeno.",
  "Non sarebbe male, per essere un'idea delle 2 di notte.",
  "Si, ma magari non in ciabatte.",
  "Prova, ma con un minimo di dignita.",
];

export const timerPresets = [15, 30, 45, 60, 90, 120, 180];
