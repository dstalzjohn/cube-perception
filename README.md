# CubeLearner

Ein Browser-basiertes Lernprogramm für Speedcubing-Anfänger mit Fokus auf Perzeptionsaufgaben.

## Beschreibung

CubeLearner trainiert die visuelle Wahrnehmung von Rubik's Cube Mustern. Anfänger lernen, Farbkombinationen schnell zu erkennen und zu bewerten - eine wichtige Fähigkeit beim Speedcubing.

## Features

- Isometrische 3D-Darstellung eines 3x3 Zauberwürfels
- Perzeptionsübungen mit Zeitmessung
- Tastatursteuerung für schnelles Training
- Detaillierte Ergebnisauswertung
- Keine Dependencies - reines Vanilla JavaScript
- GitHub Pages ready

## Verwendung

### Lokal öffnen

1. Repository klonen oder herunterladen
2. `index.html` in einem modernen Browser öffnen

### Trainingsablauf

1. **Menü**: Übung auswählen
2. **Ready**: `Leertaste` drücken zum Starten
3. **Training**: Muster bewerten
   - `J` = Das Muster ist **richtig**
   - `K` = Das Muster ist **falsch**
4. **Ergebnis**: Auswertung ansehen
   - `Leertaste` = Nochmal
   - `M` = Zurück zum Menü

## Übungen

### Kantenpaar-Erkennung

Trainiert das Erkennen korrekter Farbpaare an der Kante zwischen Front und Links.

**Korrekte Paare (Front → Links):**
| Front | Links |
|-------|-------|
| Grün | Orange |
| Rot | Grün |
| Blau | Rot |
| Orange | Blau |

## Projektstruktur

```
cubelearner/
├── index.html          # Haupt-HTML-Datei
├── css/
│   └── style.css       # Styling
├── js/
│   ├── cube.js         # Würfel-Rendering
│   ├── exercises.js    # Übungsdefinitionen
│   └── app.js          # Hauptanwendungslogik
├── docs/
│   ├── CUBE_SCHEMA.md  # Farbschema und Koordinatensystem
│   └── EXERCISES.md    # Übungs-Entwicklerdokumentation
└── README.md
```

## Dokumentation

- [Farbschema & Koordinatensystem](docs/CUBE_SCHEMA.md)
- [Übungen entwickeln](docs/EXERCISES.md)

## Technologie-Stack

- **HTML5**: Semantische Struktur
- **CSS3**: Modernes, responsives Styling
- **SVG**: Vektorgrafiken für den Würfel
- **Vanilla JavaScript**: Keine Frameworks

## Rubik's Cube Farbschema

CubeLearner verwendet das westliche Standard-Farbschema:

- **Gegenüberliegend**: Weiß ↔ Gelb, Rot ↔ Orange, Blau ↔ Grün
- **Standard-Ansicht**: Gelb oben, Grün vorne

## Entwicklung

### Neue Übung hinzufügen

Siehe [docs/EXERCISES.md](docs/EXERCISES.md) für eine Anleitung.

### API

```javascript
// Feld einfärben
setFieldColor('front', 0, 1, 'green');

// Alle Felder zurücksetzen
resetCubeColors();

// Würfel neu erstellen
createCube(svgElement, 300);
```

## GitHub Pages Deployment

1. Repository auf GitHub pushen
2. Settings → Pages → Source: "main branch"
3. Seite ist unter `https://<username>.github.io/cubelearner/` verfügbar

## Browser-Kompatibilität

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Lizenz

Frei verfügbar für Lernzwecke.

---

Entwickelt für die Speedcubing-Community
