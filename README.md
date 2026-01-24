# CubeLearner

Ein Browser-basiertes Lernprogramm für Speedcubing-Anfänger mit Fokus auf Perzeptionsaufgaben.

## Beschreibung

CubeLearner bietet eine interaktive isometrische 3x3 Zauberwürfel-Darstellung, die speziell für Anfänger entwickelt wurde, um ihre Wahrnehmung und Mustererkennung zu trainieren.

## Features (aktuell)

- Isometrische Darstellung eines 3x3 Zauberwürfels
- Vier sichtbare Seiten: Vorderseite, Oberseite, linke und rechte Seite
- SVG-basierte Darstellung für skalierbare Grafiken
- Responsive Design für alle Bildschirmgrößen
- Keine Dependencies - reines Vanilla JavaScript

## Verwendung

### Lokal öffnen

1. Repository klonen oder herunterladen
2. `index.html` in einem modernen Browser öffnen

### GitHub Pages

Dieses Projekt ist bereit für GitHub Pages Deployment:

1. Repository auf GitHub pushen
2. In den Repository-Einstellungen GitHub Pages aktivieren
3. Als Source "main branch" wählen
4. Die Seite ist unter `https://<username>.github.io/cubelearner/` verfügbar

## Projektstruktur

```
cubelearner/
├── index.html          # Haupt-HTML-Datei
├── css/
│   └── style.css       # Styling
├── js/
│   ├── cube.js         # Würfel-Rendering-Logik
│   └── app.js          # Hauptanwendungslogik
└── README.md           # Diese Datei
```

## Technologie-Stack

- **HTML5**: Semantische Struktur
- **CSS3**: Modernes, responsives Styling
- **SVG**: Vektorgrafiken für den Würfel
- **Vanilla JavaScript**: Keine Frameworks oder Libraries

## Roadmap

### Geplante Features

- **Perzeptionsaufgaben**
  - Einzelne Felder einfärben und Muster erkennen
  - Timer für Geschwindigkeitstraining
  - Fortschrittsverfolgung

- **Farbschema**
  - Standard Rubik's Cube Farben implementieren
  - Farbige Würfelseiten (Weiß, Gelb, Grün, Blau, Rot, Orange)

- **Interaktivität**
  - Felder anklickbar machen
  - Pattern-Anzeige
  - Lernmodi hinzufügen

- **Lern-Modi**
  - Pattern Recognition
  - Color Matching
  - Position Memory
  - Algorithm Visualization

## Entwicklung

### Voraussetzungen

- Ein moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Optional: Ein lokaler Webserver für Entwicklung

### Code-Struktur

#### cube.js

Enthält die gesamte Rendering-Logik:
- Isometrische Projektionsfunktionen
- SVG-Element-Erstellung
- Vier Würfelseiten-Generierung

#### app.js

Haupteinstiegspunkt:
- Initialisierung der Anwendung
- Event-Handling (zukünftig)

#### style.css

- CSS-Variablen für einfache Anpassung
- Responsive Layout
- Hover-Effekte für Interaktivität

## Technische Details

### Isometrische Projektion

Die Würfeldarstellung verwendet eine vereinfachte isometrische Projektion mit:
- 30° Winkel für die Perspektive
- Depth-Faktor: cos(30°) ≈ 0.866
- Height-Faktor: sin(30°) = 0.5

### SVG-Koordinaten

Jedes der 9 Felder pro Seite wird als separates SVG-Element erstellt mit:
- `data-face`: Welche Seite (front, top, left, right)
- `data-row`: Reihe (0-2)
- `data-col`: Spalte (0-2)
- `data-color`: Aktuelle Farbe

## Browser-Kompatibilität

- Chrome/Edge (ab Version 90)
- Firefox (ab Version 88)
- Safari (ab Version 14)

## Lizenz

Dieses Projekt ist frei verfügbar für Lernzwecke.

## Kontakt & Feedback

Bei Fragen oder Anregungen bitte ein Issue auf GitHub erstellen.

---

Entwickelt mit ❤️ für die Speedcubing-Community
