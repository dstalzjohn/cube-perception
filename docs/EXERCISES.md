# Übungen - Entwicklerdokumentation

## Übersicht

Übungen werden in `js/exercises.js` definiert. Jede Übung ist ein Objekt mit einer `generateRound()` Methode, die zufällige Runden generiert.

## Übungsstruktur

```javascript
const EXERCISES = {
  'exercise-id': {
    id: 'exercise-id',           // Eindeutige ID
    name: 'Übungsname',          // Anzeigename
    description: 'Beschreibung', // Kurze Beschreibung für das Menü
    rounds: 10,                  // Anzahl der Runden

    generateRound() {
      // Gibt ein Runden-Objekt zurück
      return {
        pattern: [
          { face: 'front', row: 0, col: 1, color: 'green' },
          // ... weitere Felder
        ],
        isCorrect: true,  // Ist das Muster "richtig"?
        // ... weitere optionale Daten
      };
    }
  }
};
```

## Pattern-Format

Das `pattern` Array enthält die Felder, die eingefärbt werden sollen:

```javascript
{
  face: 'front',  // 'front', 'left', 'right', 'top'
  row: 0,         // 0-2 (oben nach unten)
  col: 1,         // 0-2 (links nach rechts, bzw. vorne nach hinten)
  color: 'green'  // Farbname aus COLORS
}
```

## Koordinaten-Referenz

Siehe [CUBE_SCHEMA.md](./CUBE_SCHEMA.md) für das vollständige Koordinatensystem.

### Schnellreferenz für Kanten

| Kante | Face 1 | Position 1 | Face 2 | Position 2 |
|-------|--------|------------|--------|------------|
| Front-Links (oben) | front | row=0, col=1 | left | row=0, col=1 |
| Front-Rechts (oben) | front | row=0, col=1 | right | row=0, col=0 |
| Front-Oben | front | row=0, col=1 | top | row=0, col=1 |
| Links-Oben | left | row=0, col=1 | top | row=1, col=0 |
| Rechts-Oben | right | row=0, col=1 | top | row=1, col=2 |

## Bestehende Übungen

### 1. Kantenpaar-Erkennung (`edge-pair-recognition`)

**Ziel**: Erkennen, ob zwei zufällig gewählte obere Kantenfarben korrekt zueinander liegen.

**Felder** (2 von 3 werden zufällig gewählt):
- Front oben-mitte: `{ face: 'front', row: 0, col: 1 }`
- Left oben-mitte: `{ face: 'left', row: 0, col: 1 }`
- Right oben-mitte: `{ face: 'right', row: 0, col: 1 }`

**Feld-Kombinationen**:
- Front-Links
- Front-Rechts
- Links-Rechts

**Logik**:
- Je Kombination 4 korrekte und 8 falsche Paare
- 50% Chance für richtig/falsch pro Runde

---

### 2. Ecke-Kante-Erkennung (`corner-edge-recognition`)

**Ziel**: Erkennen, ob eine Ecke zur gezeigten Kante gehört (Position, nicht Orientierung).

**Konzept**:
- Die Kante (Front oben-mitte) zeigt eine Seitenfarbe
- Eine der beiden sichtbaren Ecken (links oder rechts) wird mit allen 3 Farben angezeigt
- Die Ecke kann in 3 Orientierungen gedreht sein (Gelb oben, vorne oder seitlich)
- Der User muss erkennen ob Ecke und Kante ZUSAMMENGEHÖREN

**Felder**:
- Kante: `{ face: 'front', row: 0, col: 1 }`
- Linke Ecke:
  - `{ face: 'front', row: 0, col: 0 }`
  - `{ face: 'left', row: 0, col: 0 }`
  - `{ face: 'top', row: 0, col: 0 }`
- Rechte Ecke:
  - `{ face: 'front', row: 0, col: 2 }`
  - `{ face: 'right', row: 0, col: 0 }`
  - `{ face: 'top', row: 0, col: 2 }`

**Die 4 oberen Ecken**:
| Ecke | Farben |
|------|--------|
| Vorne-Links (Grün vorne) | Gelb, Grün, Orange |
| Vorne-Rechts (Grün vorne) | Gelb, Grün, Rot |
| Vorne-Links (Blau vorne) | Gelb, Blau, Orange |
| Vorne-Rechts (Blau vorne) | Gelb, Blau, Rot |

**Korrekte Zuordnungen**:
| Kanten-Farbe | Linke Ecke | Rechte Ecke |
|--------------|------------|-------------|
| Grün | Gelb-Grün-Orange | Gelb-Grün-Rot |
| Rot | Gelb-Rot-Grün | Gelb-Rot-Blau |
| Blau | Gelb-Blau-Rot | Gelb-Blau-Orange |
| Orange | Gelb-Orange-Blau | Gelb-Orange-Grün |

**Orientierung**:
Die 3 Farben der Ecke rotieren durch die 3 Positionen:
- Orientierung 0: [Farbe1 auf Front, Farbe2 auf Seite, Farbe3 auf Top]
- Orientierung 1: [Farbe3 auf Front, Farbe1 auf Seite, Farbe2 auf Top]
- Orientierung 2: [Farbe2 auf Front, Farbe3 auf Seite, Farbe1 auf Top]

**Logik**:
- 50% Chance für richtig/falsch pro Runde
- Zufällige Orientierung der Ecke (0, 1 oder 2)

## Neue Übung erstellen

### Schritt 1: Übung definieren

```javascript
// In js/exercises.js

const EXERCISES = {
  // ... bestehende Übungen ...

  'neue-uebung-id': {
    id: 'neue-uebung-id',
    name: 'Neue Übung',
    description: 'Beschreibung der Übung',
    rounds: 10,

    generateRound() {
      // Deine Logik hier
      const isCorrect = Math.random() < 0.5;

      return {
        pattern: [
          { face: 'front', row: 0, col: 1, color: 'green' },
          // ... weitere Felder
        ],
        isCorrect: isCorrect
      };
    }
  }
};
```

### Schritt 2: Testen

1. Öffne `index.html` im Browser
2. Die neue Übung erscheint automatisch im Menü
3. Teste alle Runden und die Ergebnisanzeige

## Ideen für weitere Übungen

### Drei Kanten gleichzeitig

Zeige Front-Links, Front-Rechts und Front-Oben:
- Erhöht die Schwierigkeit
- User muss alle drei Paare gleichzeitig bewerten

### Ecken-Orientierung

Wie Ecke-Kante-Erkennung, aber:
- Prüfen ob die Ecke korrekt ORIENTIERT ist (Gelb oben)
- Nicht nur ob sie an der richtigen Position ist

### Zeitdruck-Modus

Wie bestehende Übungen, aber:
- Zeitlimit pro Runde (z.B. 2 Sekunden)
- Automatisch "falsch" bei Zeitüberschreitung

## App-Struktur

```
js/
├── cube.js       # Würfel-Rendering, setFieldColor(), resetCubeColors()
├── exercises.js  # Übungsdefinitionen
└── app.js        # State Machine, Timer, Keyboard-Handler

Ablauf:
1. Menu → User wählt Übung
2. Ready → User drückt Leertaste
3. Running → generateRound() wird aufgerufen, pattern wird angezeigt
4. User drückt J/K → submitAnswer() vergleicht mit isCorrect
5. Nach 10 Runden → Result Screen
```

## Farbkonstanten

Definiert in `js/cube.js`:

```javascript
const COLORS = {
  gray: '#808080',
  white: '#FFFFFF',
  yellow: '#FFFF00',
  green: '#00FF00',
  blue: '#0000FF',
  red: '#FF0000',
  orange: '#FFA500'
};
```

Für Übungen sollten nur die 4 Seitenfarben verwendet werden:
- `green`, `red`, `blue`, `orange`

(Gelb und Weiß sind für Ober-/Unterseite reserviert)
