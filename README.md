# 🎮 Lernapp - Quiz Spiel

Eine interaktive Quiz-App im Stil von Quizduell, gebaut mit Next.js und TypeScript.

## ✨ Features

- **Quiz-Modus**: Multiple-Choice-Fragen mit 4 Antwortmöglichkeiten
- **20-Sekunden-Timer**: Jede Frage hat ein Zeitlimit
- **Visuelles Feedback**:
  - ✅ Grün für richtige Antworten
  - ❌ Rot für falsche Antworten
- **Score-Tracking**: Verfolge deinen Punktestand
- **Kategorien**: Fragen können nach Themen organisiert werden
- **Erweiterbar**: Einfaches Hinzufügen neuer Spiele/Features

## 🚀 Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## 📝 Fragen hinzufügen

Bearbeite die Datei `data/questions.md` und füge neue Fragen nach diesem Format hinzu:

```markdown
## Frage X
**Frage:** Deine Frage hier?
**Optionen:**
- Option 1
- Option 2
- Option 3
- Option 4
**Antwort:** Option 2
**Kategorie:** Deine Kategorie
---
```

### Wichtig:
- Die **Antwort** muss exakt einer **Option** entsprechen
- Jede Frage endet mit `---`
- Du kannst beliebig viele Fragen hinzufügen

## 🎯 Spielablauf

1. **Start**: Klicke auf "Spiel starten"
2. **Frage beantworten**: Wähle eine der 4 Optionen
3. **Feedback**: Sofortiges visuelles Feedback (grün/rot)
4. **Timer**: 20 Sekunden pro Frage
5. **Ergebnis**: Am Ende siehst du deinen Score

## 🛠️ Technologie-Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Datenverwaltung**: Markdown-Datei (.md)

## 📁 Projektstruktur

```
lernapp/
├── app/
│   ├── api/questions/   # API zum Laden der Fragen
│   └── page.tsx         # Quiz-Interface
├── data/
│   └── questions.md     # Fragendatenbank
└── lib/
    └── questions.ts     # Question Parser
```

## 🔮 Zukünftige Features

- Weitere Spielmodi
- Multiplayer-Funktion
- Statistiken & Highscores
- Verschiedene Schwierigkeitsstufen
- Zeitbasierte Bonuspunkte

## 📄 Lizenz

Dieses Projekt ist für Bildungszwecke erstellt.
