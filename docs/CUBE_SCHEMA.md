# Rubik's Cube Farbschema und Koordinatensystem

## Standard Farbschema (Westlich)

Das westliche Farbschema ist der Standard für alle modernen Speedcubes seit 1988.

### Gegenüberliegende Seiten

| Seite 1 | Seite 2 |
|---------|---------|
| Weiß (white) | Gelb (yellow) |
| Rot (red) | Orange (orange) |
| Blau (blue) | Grün (green) |

### Anordnung bei Gelb oben

Wenn Gelb oben und Weiß unten ist, sind die 4 Seitenfarben im **Uhrzeigersinn** (von oben betrachtet):

```
        Gelb (oben)
           ↑
    Blau ← · → Grün
           ↓
    (von oben gesehen)

Uhrzeigersinn: Rot → Grün → Orange → Blau → Rot...
```

### Farben in unserer Ansicht

In CubeLearner zeigen wir den Würfel mit:
- **Gelb** oben (nicht sichtbar, aber als Referenz)
- **Weiß** unten (nicht sichtbar)
- **Front** = Grün (Standardansicht)
- **Links** = Orange
- **Rechts** = Rot
- **Oben** = Gelb

## Koordinatensystem

### Allgemein

Jede Seite hat ein 3x3 Raster:
- **row**: 0 = oben, 1 = mitte, 2 = unten
- **col**: 0 = links, 1 = mitte, 2 = rechts

### Front-Seite (Vorderseite)

```
        col 0   col 1   col 2
       +-------+-------+-------+
row 0  | 0,0   | 0,1   | 0,2   |  ← oben
       +-------+-------+-------+
row 1  | 1,0   | 1,1   | 1,2   |  ← mitte
       +-------+-------+-------+
row 2  | 2,0   | 2,1   | 2,2   |  ← unten
       +-------+-------+-------+
         ↑       ↑       ↑
       links   mitte  rechts
```

### Linke Seite

Die linke Seite geht perspektivisch nach links-oben.

```
        col 0   col 1   col 2
       (vorne) (mitte) (hinten)
       +-------+-------+-------+
row 0  | 0,0   | 0,1   | 0,2   |  ← oben
       +-------+-------+-------+
row 1  | 1,0   | 1,1   | 1,2   |  ← mitte
       +-------+-------+-------+
row 2  | 2,0   | 2,1   | 2,2   |  ← unten
       +-------+-------+-------+
         ↑       ↑       ↑
       rechts  mitte   links
       (→Front)       (→hinten)
```

**Wichtig**: `col 0` ist die Spalte, die an die Front-Seite angrenzt (= "rechts" wenn man die linke Seite direkt anschaut).

### Rechte Seite

Die rechte Seite geht perspektivisch nach rechts-oben.

```
        col 0   col 1   col 2
       (vorne) (mitte) (hinten)
       +-------+-------+-------+
row 0  | 0,0   | 0,1   | 0,2   |  ← oben
       +-------+-------+-------+
row 1  | 1,0   | 1,1   | 1,2   |  ← mitte
       +-------+-------+-------+
row 2  | 2,0   | 2,1   | 2,2   |  ← unten
       +-------+-------+-------+
         ↑       ↑       ↑
       links   mitte  rechts
       (→Front)       (→hinten)
```

**Wichtig**: `col 0` ist die Spalte, die an die Front-Seite angrenzt (= "links" wenn man die rechte Seite direkt anschaut).

### Obere Seite

Die obere Seite geht perspektivisch nach oben und außen.

```
        col 0   col 1   col 2
       +-------+-------+-------+
row 0  | 0,0   | 0,1   | 0,2   |  ← vorne (an Front)
       +-------+-------+-------+
row 1  | 1,0   | 1,1   | 1,2   |  ← mitte
       +-------+-------+-------+
row 2  | 2,0   | 2,1   | 2,2   |  ← hinten
       +-------+-------+-------+
         ↑       ↑       ↑
       links   mitte  rechts
```

## Kanten (Edges)

Kanten sind die Teile des Würfels mit 2 Farben. Sie liegen zwischen zwei Seiten.

### Kante Front-Links (oben)

Diese Kante verbindet:
- **Front** oben-mitte: `{ face: 'front', row: 0, col: 1 }`
- **Left** oben-mitte: `{ face: 'left', row: 0, col: 1 }`

Bei gelöstem Würfel: Front = Grün, Left = Orange

### Kante Front-Rechts (oben)

Diese Kante verbindet:
- **Front** oben-mitte: `{ face: 'front', row: 0, col: 1 }`
- **Right** oben-links: `{ face: 'right', row: 0, col: 0 }`

Bei gelöstem Würfel: Front = Grün, Right = Rot

### Kante Front-Oben

Diese Kante verbindet:
- **Front** oben-mitte: `{ face: 'front', row: 0, col: 1 }`
- **Top** vorne-mitte: `{ face: 'top', row: 0, col: 1 }`

Bei gelöstem Würfel: Front = Grün, Top = Gelb

## Ecken (Corners)

Ecken sind die Teile des Würfels mit 3 Farben. Sie liegen an den Schnittpunkten von drei Seiten.

### Ecke Front-Links-Oben

Diese Ecke verbindet:
- **Front** oben-links: `{ face: 'front', row: 0, col: 0 }`
- **Left** oben-rechts: `{ face: 'left', row: 0, col: 0 }`
- **Top** vorne-links: `{ face: 'top', row: 0, col: 0 }`

Bei gelöstem Würfel: Front = Grün, Left = Orange, Top = Gelb

### Ecke Front-Rechts-Oben

Diese Ecke verbindet:
- **Front** oben-rechts: `{ face: 'front', row: 0, col: 2 }`
- **Right** oben-links: `{ face: 'right', row: 0, col: 0 }`
- **Top** vorne-rechts: `{ face: 'top', row: 0, col: 2 }`

Bei gelöstem Würfel: Front = Grün, Right = Rot, Top = Gelb

## Korrekte Farbpaare (Kanten)

### Front ↔ Links

| Front | Links | Korrekt? |
|-------|-------|----------|
| Grün | Orange | ✓ |
| Rot | Grün | ✓ |
| Blau | Rot | ✓ |
| Orange | Blau | ✓ |

### Front ↔ Rechts

| Front | Rechts | Korrekt? |
|-------|--------|----------|
| Grün | Rot | ✓ |
| Rot | Blau | ✓ |
| Blau | Orange | ✓ |
| Orange | Grün | ✓ |

Alle anderen Kombinationen sind **falsch**.

## Korrekte Ecken (Obere Ebene)

Die 4 oberen Ecken enthalten immer Gelb plus zwei benachbarte Seitenfarben:

| Ecke | Farben |
|------|--------|
| 1 | Gelb, Grün, Orange |
| 2 | Gelb, Grün, Rot |
| 3 | Gelb, Blau, Rot |
| 4 | Gelb, Blau, Orange |

## Verwendung in Übungen

### Feld einfärben

```javascript
setFieldColor(face, row, col, color);

// Beispiele:
setFieldColor('front', 0, 1, 'green');  // Front oben-mitte grün
setFieldColor('left', 0, 0, 'orange');  // Left oben-rechts orange
```

### Alle Felder zurücksetzen

```javascript
resetCubeColors();  // Alle Felder werden grau
```

### Verfügbare Farben

```javascript
const COLORS = {
  gray: '#808080',    // Standard (neutral)
  white: '#FFFFFF',   // Weiß
  yellow: '#FFFF00',  // Gelb
  green: '#00FF00',   // Grün
  blue: '#0000FF',    // Blau
  red: '#FF0000',     // Rot
  orange: '#FFA500'   // Orange
};
```
