export type TabWhoCard = {
  parola: string;
  taboo: [string, string, string, string, string];
};

// Dataset iniziale del gioco. Ogni carta ha una parola principale e 5 taboo.
export const parole: TabWhoCard[] = [
  {
    parola: "Pizza",
    taboo: ["Formaggio", "Forno", "Margherita", "Impasto", "Fetta"],
  },
  {
    parola: "Gelato",
    taboo: ["Cono", "Freddo", "Gusto", "Estate", "Crema"],
  },
  {
    parola: "Spaghetti",
    taboo: ["Pasta", "Forchetta", "Pomodoro", "Piatto", "Sugo"],
  },
  {
    parola: "Hamburger",
    taboo: ["Panino", "Carne", "Fast food", "Patatine", "Ketchup"],
  },
  {
    parola: "Torta",
    taboo: ["Candeline", "Compleanno", "Dolce", "Fetta", "Crema"],
  },
  {
    parola: "Insalata",
    taboo: ["Verdura", "Ciotola", "Pomodoro", "Lattuga", "Condire"],
  },
  {
    parola: "Banana",
    taboo: ["Frutta", "Gialla", "Scimmia", "Buccia", "Tropicale"],
  },
  {
    parola: "Sedia",
    taboo: ["Sedersi", "Legno", "Tavolo", "Quattro gambe", "Schienale"],
  },
  {
    parola: "Orologio",
    taboo: ["Tempo", "Polso", "Lancette", "Ora", "Sveglia"],
  },
  {
    parola: "Ombrello",
    taboo: ["Pioggia", "Aprire", "Temporale", "Bagnato", "Ripararsi"],
  },
  {
    parola: "Bicicletta",
    taboo: ["Pedali", "Ruote", "Casco", "Corsa", "Catena"],
  },
  {
    parola: "Lampada",
    taboo: ["Luce", "Scrivania", "Accendere", "Paralume", "Interruttore"],
  },
  {
    parola: "Valigia",
    taboo: ["Viaggio", "Aeroporto", "Vestiti", "Ruote", "Bagaglio"],
  },
  {
    parola: "Specchio",
    taboo: ["Riflesso", "Bagno", "Vetro", "Guardarsi", "Immagine"],
  },
  {
    parola: "Cane",
    taboo: ["Abbaia", "Guinzaglio", "Cuccia", "Amico", "Zampe"],
  },
  {
    parola: "Gatto",
    taboo: ["Miagola", "Baffi", "Fusa", "Lettiera", "Zampe"],
  },
  {
    parola: "Leone",
    taboo: ["Giungla", "Criniera", "Ruggito", "Re", "Savana"],
  },
  {
    parola: "Elefante",
    taboo: ["Proboscide", "Grande", "Africa", "Zanne", "Mammifero"],
  },
  {
    parola: "Delfino",
    taboo: ["Mare", "Nuota", "Salta", "Pinne", "Acquario"],
  },
  {
    parola: "Coniglio",
    taboo: ["Carota", "Orecchie", "Tana", "Saltare", "Morbido"],
  },
  {
    parola: "Pinguino",
    taboo: ["Ghiaccio", "Antartide", "Bianco e nero", "Becco", "Polo Sud"],
  },
  {
    parola: "Medico",
    taboo: ["Ospedale", "Camice", "Visita", "Paziente", "Stetoscopio"],
  },
  {
    parola: "Insegnante",
    taboo: ["Scuola", "Classe", "Lavagna", "Compiti", "Lezione"],
  },
  {
    parola: "Cuoco",
    taboo: ["Cucina", "Ricetta", "Ristorante", "Padella", "Chef"],
  },
  {
    parola: "Poliziotto",
    taboo: ["Divisa", "Sirena", "Legge", "Controllo", "Volante"],
  },
  {
    parola: "Astronauta",
    taboo: ["Spazio", "Razzo", "Luna", "Casco", "Navicella"],
  },
  {
    parola: "Pittore",
    taboo: ["Quadro", "Pennello", "Colori", "Tela", "Artista"],
  },
  {
    parola: "Parrucchiere",
    taboo: ["Capelli", "Forbici", "Taglio", "Specchio", "Salone"],
  },
  {
    parola: "Scuola",
    taboo: ["Studenti", "Classe", "Professore", "Campanella", "Aula"],
  },
  {
    parola: "Spiaggia",
    taboo: ["Mare", "Sabbia", "Ombrellone", "Vacanza", "Asciugamano"],
  },
  {
    parola: "Montagna",
    taboo: ["Neve", "Sentiero", "Cima", "Scalata", "Rifugio"],
  },
  {
    parola: "Biblioteca",
    taboo: ["Libri", "Silenzio", "Scaffale", "Studio", "Prestito"],
  },
  {
    parola: "Stadio",
    taboo: ["Tifosi", "Partita", "Tribuna", "Campo", "Biglietto"],
  },
  {
    parola: "Aeroporto",
    taboo: ["Aereo", "Valigia", "Partenza", "Gate", "Terminal"],
  },
  {
    parola: "Cinema",
    taboo: ["Film", "Schermo", "Sala", "Popcorn", "Proiettore"],
  },
  {
    parola: "Computer",
    taboo: ["Schermo", "Tastiera", "Mouse", "Internet", "Desktop"],
  },
  {
    parola: "Internet",
    taboo: ["Wifi", "Online", "Sito", "Connessione", "Rete"],
  },
  {
    parola: "Videogioco",
    taboo: ["Console", "Livello", "Joystick", "Giocare", "Missione"],
  },
  {
    parola: "Robot",
    taboo: ["Macchina", "Metallo", "Automatico", "Futuro", "Sensore"],
  },
  {
    parola: "Fotocamera",
    taboo: ["Foto", "Obiettivo", "Scattare", "Immagine", "Zoom"],
  },
  {
    parola: "Tablet",
    taboo: ["Touch", "Schermo", "App", "Portatile", "Digitale"],
  },
  {
    parola: "Cuffie",
    taboo: ["Musica", "Orecchie", "Ascoltare", "Suono", "Auricolari"],
  },
  {
    parola: "Calcio",
    taboo: ["Pallone", "Porta", "Gol", "Campo", "Arbitro"],
  },
  {
    parola: "Tennis",
    taboo: ["Racchetta", "Palla", "Rete", "Campo", "Set"],
  },
  {
    parola: "Nuoto",
    taboo: ["Piscina", "Acqua", "Corsia", "Bracciate", "Costume"],
  },
  {
    parola: "Basket",
    taboo: ["Canestro", "Palla", "Squadra", "Palleggio", "Parquet"],
  },
  {
    parola: "Ciclismo",
    taboo: ["Bici", "Pedali", "Gara", "Casco", "Tour"],
  },
  {
    parola: "Sci",
    taboo: ["Neve", "Pista", "Bastoncini", "Montagna", "Slalom"],
  },
  {
    parola: "Pallavolo",
    taboo: ["Rete", "Squadra", "Palla", "Schiacciata", "Servizio"],
  },
  {
    parola: "Supereroe",
    taboo: ["Mantello", "Poteri", "Salvare", "Cattivo", "Maschera"],
  },
  {
    parola: "Pirata",
    taboo: ["Nave", "Tesoro", "Mare", "Benda", "Pappagallo"],
  },
  {
    parola: "Mago",
    taboo: ["Bacchetta", "Incantesimo", "Cappello", "Trucco", "Coniglio"],
  },
  {
    parola: "Detective",
    taboo: ["Indagine", "Lente", "Mistero", "Polizia", "Caso"],
  },
  {
    parola: "Cantante",
    taboo: ["Microfono", "Canzone", "Palco", "Voce", "Concerto"],
  },
  {
    parola: "Attore",
    taboo: ["Film", "Scena", "Cinema", "Recitare", "Copione"],
  },
  {
    parola: "Teatro",
    taboo: ["Palco", "Sipario", "Spettacolo", "Pubblico", "Platea"],
  },
];

export const tabWhoCards = parole;
