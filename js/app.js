/**
 * CubeLearner - Hauptanwendungslogik
 * Initialisiert die Anwendung und verwaltet den Würfel
 */

document.addEventListener('DOMContentLoaded', () => {
  // Hole das SVG-Element
  const svgElement = document.getElementById('cube');

  if (!svgElement) {
    console.error('SVG-Element mit ID "cube" nicht gefunden!');
    return;
  }

  // Erstelle den Würfel
  createCube(svgElement, 300);

  console.log('CubeLearner initialisiert!');
});
