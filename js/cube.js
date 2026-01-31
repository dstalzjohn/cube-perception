/**
 * CubeLearner - Würfel-Rendering-Modul
 * Erstellt eine isometrische Ansicht eines 3x3 Zauberwürfels mit SVG
 *
 * Ansicht: Vorderseite als Quadrat, obere/linke/rechte Seiten perspektivisch nach oben-außen
 */

// ============================================================
// PERSPEKTIV-EINSTELLUNGEN
// ============================================================
// Fester Winkel: 70 Grad
const PERSPECTIVE_ANGLE_DEGREES = 70;
const ANGLE_RAD = PERSPECTIVE_ANGLE_DEGREES * Math.PI / 180;

// Tiefenskalierung (0-100%): Bestimmt wie weit die Seiten nach hinten gehen
// - 100% = volle Tiefe (gleiche Länge wie Vorderseite)
// - 50% = halbe Tiefe
// - 30% = flache Darstellung
let DEPTH_SCALE = 50;

// Berechnete Faktoren
let DEPTH_FACTOR = Math.cos(ANGLE_RAD) * (DEPTH_SCALE / 100);
let HEIGHT_FACTOR = Math.sin(ANGLE_RAD) * (DEPTH_SCALE / 100);

/**
 * Aktualisiert die Tiefenskalierung
 */
function updateDepthScale(scalePercent) {
  DEPTH_SCALE = scalePercent;
  DEPTH_FACTOR = Math.cos(ANGLE_RAD) * (DEPTH_SCALE / 100);
  HEIGHT_FACTOR = Math.sin(ANGLE_RAD) * (DEPTH_SCALE / 100);
}

// Standard-Farben
const COLORS = {
  gray: '#808080',
  white: '#FFFFFF',
  yellow: '#FFFF00',
  green: '#00FF00',
  blue: '#0000FF',
  red: '#FF0000',
  orange: '#FFA500'
};

/**
 * Färbt ein bestimmtes Feld auf dem Würfel ein
 * @param {string} face - 'front', 'top', 'left', 'right'
 * @param {number} row - Reihe (0-2)
 * @param {number} col - Spalte (0-2)
 * @param {string} color - Farbname aus COLORS oder Hex-Wert
 */
function setFieldColor(face, row, col, color) {
  const field = document.querySelector(`[data-face="${face}"][data-row="${row}"][data-col="${col}"]`);
  if (field) {
    const colorValue = COLORS[color] || color;
    field.style.fill = colorValue;
    field.setAttribute('data-color', color);
  }
}

/**
 * Setzt alle Felder auf grau zurück
 */
function resetCubeColors() {
  const fields = document.querySelectorAll('.cube-field');
  fields.forEach(field => {
    field.style.fill = COLORS.gray;
    field.setAttribute('data-color', 'gray');
    field.classList.remove('highlight');
  });
}

/**
 * Hebt ein Feld hervor (dunkler mit hellem Rahmen)
 * @param {string} face - 'front', 'top', 'left', 'right'
 * @param {number} row - Reihe (0-2)
 * @param {number} col - Spalte (0-2)
 */
function highlightField(face, row, col) {
  const field = document.querySelector(`[data-face="${face}"][data-row="${row}"][data-col="${col}"]`);
  if (field) {
    field.classList.add('highlight');
    field.setAttribute('data-color', 'highlight');
  }
}

// Gap zwischen Feldern
const GAP = 3;

/**
 * Erstellt ein SVG-Polygon-Element
 */
function createPolygon(points, color, dataAttributes) {
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', points);
  polygon.setAttribute('class', 'cube-field');

  if (color) {
    polygon.style.fill = color;
  }

  if (dataAttributes) {
    Object.keys(dataAttributes).forEach(key => {
      polygon.setAttribute(`data-${key}`, dataAttributes[key]);
    });
  }

  return polygon;
}

/**
 * Erstellt ein SVG-Rechteck-Element
 */
function createRect(x, y, size, color, dataAttributes) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', size);
  rect.setAttribute('height', size);
  rect.setAttribute('class', 'cube-field');

  if (color) {
    rect.style.fill = color;
  }

  if (dataAttributes) {
    Object.keys(dataAttributes).forEach(key => {
      rect.setAttribute(`data-${key}`, dataAttributes[key]);
    });
  }

  return rect;
}

/**
 * Verkleinert ein Polygon um den Gap-Wert
 */
function shrinkPolygon(p1, p2, p3, p4, shrinkAmount) {
  const cx = (p1.x + p2.x + p3.x + p4.x) / 4;
  const cy = (p1.y + p2.y + p3.y + p4.y) / 4;

  function shrinkPoint(p) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: p.x, y: p.y };
    const factor = (len - shrinkAmount) / len;
    return {
      x: cx + dx * factor,
      y: cy + dy * factor
    };
  }

  return {
    p1: shrinkPoint(p1),
    p2: shrinkPoint(p2),
    p3: shrinkPoint(p3),
    p4: shrinkPoint(p4)
  };
}

/**
 * Erstellt die Vorderseite des Würfels (Rechtecke)
 */
function createFrontFace(baseX, baseY, faceSize) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', 'front-face');

  const fieldSize = faceSize / 3;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = baseX + col * fieldSize + GAP;
      const y = baseY + row * fieldSize + GAP;

      const rect = createRect(
        x,
        y,
        fieldSize - GAP * 2,
        COLORS.gray,
        { face: 'front', row: row, col: col, color: 'gray' }
      );

      group.appendChild(rect);
    }
  }

  return group;
}

/**
 * Erstellt die obere Seite des Würfels
 * Die Felder sind Rauten: linke Kante geht nach links-oben, rechte Kante nach rechts-oben
 */
function createTopFace(baseX, baseY, faceSize) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', 'top-face');

  const fieldSize = faceSize / 3;

  // Gitterpunkt-Funktion für die obere Seite
  // r: 0 = vordere Kante (auf der Vorderseite), 3 = hintere Kante
  // c: 0 = links, 3 = rechts
  function getGridPoint(r, c) {
    // centerOffset: -1 bei c=0, 0 bei c=1.5, +1 bei c=3
    const centerOffset = (c - 1.5) / 1.5;
    const x = baseX + c * fieldSize + centerOffset * r * fieldSize * DEPTH_FACTOR;
    const y = baseY - r * fieldSize * HEIGHT_FACTOR;
    return { x, y };
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // Die 4 Eckpunkte des Feldes
      const p1 = getGridPoint(row, col);         // vorne links
      const p2 = getGridPoint(row, col + 1);     // vorne rechts
      const p3 = getGridPoint(row + 1, col + 1); // hinten rechts
      const p4 = getGridPoint(row + 1, col);     // hinten links

      // Polygon mit Gap verkleinern
      const shrunk = shrinkPolygon(p1, p2, p3, p4, GAP);
      const points = `${shrunk.p1.x},${shrunk.p1.y} ${shrunk.p2.x},${shrunk.p2.y} ${shrunk.p3.x},${shrunk.p3.y} ${shrunk.p4.x},${shrunk.p4.y}`;

      const polygon = createPolygon(
        points,
        COLORS.gray,
        { face: 'top', row: row, col: col, color: 'gray' }
      );

      group.appendChild(polygon);
    }
  }

  return group;
}

/**
 * Erstellt die linke Seite des Würfels (Parallelogramme nach links-oben)
 */
function createLeftFace(baseX, baseY, faceSize) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', 'left-face');

  const fieldSize = faceSize / 3;

  // Gitterpunkt-Funktion für die linke Seite
  // r: 0 = oben, 3 = unten (auf der Vorderseite)
  // c: 0 = vorne (an der Vorderseite), 3 = hinten (nach links-oben)
  function getGridPoint(r, c) {
    const x = baseX - c * fieldSize * DEPTH_FACTOR;
    const y = baseY + r * fieldSize - c * fieldSize * HEIGHT_FACTOR;
    return { x, y };
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // Die 4 Eckpunkte des Feldes
      const p1 = getGridPoint(row, col);         // oben vorne
      const p2 = getGridPoint(row + 1, col);     // unten vorne
      const p3 = getGridPoint(row + 1, col + 1); // unten hinten
      const p4 = getGridPoint(row, col + 1);     // oben hinten

      // Polygon mit Gap verkleinern
      const shrunk = shrinkPolygon(p1, p2, p3, p4, GAP);
      const points = `${shrunk.p1.x},${shrunk.p1.y} ${shrunk.p2.x},${shrunk.p2.y} ${shrunk.p3.x},${shrunk.p3.y} ${shrunk.p4.x},${shrunk.p4.y}`;

      const polygon = createPolygon(
        points,
        COLORS.gray,
        { face: 'left', row: row, col: col, color: 'gray' }
      );

      group.appendChild(polygon);
    }
  }

  return group;
}

/**
 * Erstellt die rechte Seite des Würfels (Parallelogramme nach rechts-oben)
 */
function createRightFace(baseX, baseY, faceSize) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('id', 'right-face');

  const fieldSize = faceSize / 3;

  // Gitterpunkt-Funktion für die rechte Seite
  // r: 0 = oben, 3 = unten (auf der Vorderseite)
  // c: 0 = vorne (an der Vorderseite), 3 = hinten (nach rechts-oben)
  function getGridPoint(r, c) {
    const x = baseX + faceSize + c * fieldSize * DEPTH_FACTOR;
    const y = baseY + r * fieldSize - c * fieldSize * HEIGHT_FACTOR;
    return { x, y };
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // Die 4 Eckpunkte des Feldes
      const p1 = getGridPoint(row, col);         // oben vorne
      const p2 = getGridPoint(row + 1, col);     // unten vorne
      const p3 = getGridPoint(row + 1, col + 1); // unten hinten
      const p4 = getGridPoint(row, col + 1);     // oben hinten

      // Polygon mit Gap verkleinern
      const shrunk = shrinkPolygon(p1, p2, p3, p4, GAP);
      const points = `${shrunk.p1.x},${shrunk.p1.y} ${shrunk.p2.x},${shrunk.p2.y} ${shrunk.p3.x},${shrunk.p3.y} ${shrunk.p4.x},${shrunk.p4.y}`;

      const polygon = createPolygon(
        points,
        COLORS.gray,
        { face: 'right', row: row, col: col, color: 'gray' }
      );

      group.appendChild(polygon);
    }
  }

  return group;
}

/**
 * Hauptfunktion: Erstellt den kompletten Würfel
 * @param {SVGElement} svgElement - Das SVG-Element, in das gezeichnet wird
 * @param {number} faceSize - Größe einer Würfelseite in Pixeln (default: 300)
 */
function createCube(svgElement, faceSize = 300) {
  // Leere das SVG-Element
  svgElement.innerHTML = '';

  // Berechne die Basis-Position für den Würfel
  // baseX, baseY = obere linke Ecke der Vorderseite
  const baseX = 300;
  const baseY = 300;

  // Erstelle die vier sichtbaren Seiten in der richtigen Z-Order
  // (von hinten nach vorne für korrekte Überlappung)
  const topFace = createTopFace(baseX, baseY, faceSize);
  const leftFace = createLeftFace(baseX, baseY, faceSize);
  const rightFace = createRightFace(baseX, baseY, faceSize);
  const frontFace = createFrontFace(baseX, baseY, faceSize);

  // Füge die Seiten in der richtigen Reihenfolge hinzu
  svgElement.appendChild(topFace);
  svgElement.appendChild(leftFace);
  svgElement.appendChild(rightFace);
  svgElement.appendChild(frontFace);
}
