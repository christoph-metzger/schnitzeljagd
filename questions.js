const QUESTIONS = [
    {
        audio: "raetsel1.mp3",
        question: "🎵 Hör dir das Hörrätsel an! Welcher Ort ist gemeint?",
        answers: ["Dachgeschoss", "Zimmer Christoph", "Christophs Zimmer"],
        hint: "Denk an den Ort des Videos.",
        currentLocation: "🏠 Du bist am Startpunkt",
        location: "📍 Den nächsten Hinweis findest du in Christophs Zimmer"
    },
    {
        question: "Wie viele 🦆 kannst du dort entdecken?",
        answers: ["9", "neun"],
        hint: "Schau genau hin und finde alle Enten! Es sind zwischen 1 und 73 Enten versteckt.",
        currentLocation: "🛏️ Du bist in Christophs Zimmer",
        location: "📍 Es geht in der Küche weiter."
    },
    {
        question: "Finde das nächste Rätsel und löse es um zu erfahren, wo es weiter geht. Lösungswort:",
        answers: ["Spielplatz", "spielplatz", "SPIELPLATZ"],
        hint: "Finde jemanden der dir bei dem Rätsel hilft.",
        currentLocation: "🍳 Du bist in der Küche",
        location: "📍 Auf dem Spielplatz ist der nächste Hinweis versteckt."
    },
    {
        question: "Suche Rebus. Er gibt dir den Hinweis für den nächsten Ort.",
        answers: ["Wohnwagen", "wohnwagen", "wohnwaagen"],
        hint: "Denke etwas um die Ecke und schau genau hin, was auf dem Rebus zu sehen ist.",
        currentLocation: "🛝 Du bist auf dem Spielplatz",
        location: "📍 Es geht weiter zum Wohnwagen."
    },
    {
        question: "Was du dort findest muss in die richtige Reihenfolge gebracht werden. Damit kommst du auf den nächsten Ort. Der nächste Ort ist:",
        answers: ["garage", "Garage"],
        hint: "1-24 | ABC",
        currentLocation: "🚐 Du bist am Wohnwagen",
        location: "📍 Suche den nächsten Hinweis in der Garage."
    },
    {
        question: "Wie viele Türme findest du in der Garage?",
        answers: ["14", "vierzehn", "15", "fünfzehn"],
        hint: "Ein Turm ist ein vertikal ausgerichtetes, hoch aufragendes Bauwerk mit vergleichsweise kleiner Grundfläche, das frei stehen oder Teil eines größeren Gebäudes (z.B. Kirche, Burg) sein kann.",
        currentLocation: "🏚️ Du bist in der Garage",
        location: "📍 Du hast es geschafft!"
    }
];

const PASSWORD = "14Maerz2026";
