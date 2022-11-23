const margin = 50;
let _planets;
let planets;

function preload() {
  _planets = loadJSON('planets.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  const diameters = Object.values(_planets).map((_) => _.diameter);
  const numPlanets = diameters.length;
  const rMin = min(diameters);
  const rMax = max(diameters);
  planets = Object.values(_planets).map((planet, i) => ({
    name: planet.name,
    r: round(map(planet.diameter, rMin, rMax, 5, 60)),
    x: map(i, 0, numPlanets, margin, width),
    active: false,
    moons: planet.moons.map((_) => ({
      dR: random(-6, 6),
      omega: random(0.002, 0.006),
    })),
  }));
  colorMode(HSL);
}

function draw() {
  background(0, 0, 0, 1);
  noStroke();
  planets.forEach((planet, i) => {
    push();
    translate(planet.x, windowHeight / 2);
    const hue = 0 + i * 40;
    fill(hue, 90, 50);
    circle(0, 0, planet.r);
    textAlign(CENTER);
    fill(0, 0, 100);
    text(planet.name, 0, 100);
    pop();
    drawMoons(planet, hue);
  });
}

const animSteps = 600;
function drawMoons(planet, hue) {
  planet.moons.forEach((moon, i) => {
    push();
    translate(planet.x, windowHeight / 2);
    let r = 2;
    if (!planet.active) {
      const rotation = (moon.omega * millis()) / 10;
      const phi = p5.Vector.fromAngle(map(i, 0, planet.moons.length, 0, 2 * PI) + rotation, 50 + moon.dR);
      translate(phi);
    } else {
      if (planet.activatedAt + animSteps > millis()) {
        push();
        // go to end position
        translate(0, -40 - i * 5);
        const endPosition = getOrigoPosition();
        pop();

        // go to start position
        const rotation = (moon.omega * planet.activatedAt) / 10;
        const phi = p5.Vector.fromAngle(map(i, 0, planet.moons.length, 0, 2 * PI) + rotation, 50 + moon.dR);
        translate(phi);
        const startPosition = getOrigoPosition();

        const dx = endPosition.x - startPosition.x;
        const dy = endPosition.y - startPosition.y;

        translate(
          (dx * (millis() - planet.activatedAt)) / animSteps,
          (dy * (millis() - planet.activatedAt)) / animSteps
        );
      } else {
        translate(0, -40 - i * 5);
      }

      r = (i + 1) % 10 ? 2 : 4;
      if (!((i + 1) % 50)) {
        fill(0, 0, 0);
        stroke(0, 0, 100);
        strokeWeight(2);
      }
    }
    fill(hue, 90, 50);
    circle(0, 0, r);
    pop();
  });
}

function mouseMoved() {
  planets.forEach((planet) => {
    const isThisActive = abs(planet.x - mouseX) < 50 ? true : false;
    if (planet.active !== isThisActive) {
      planet.active = isThisActive;
      if (isThisActive) planet.activatedAt = millis();
    }
  });
}

function getOrigoPosition() {
  let matrix = drawingContext.getTransform();
  let x_0 = matrix['e'];
  let y_0 = matrix['f'];
  let x_1 = matrix['a'] + matrix['e'];
  let y_1 = matrix['b'] + matrix['f'];
  let media_per_unit = dist(x_0, y_0, x_1, y_1);
  let p5_current_x = x_0 / media_per_unit;
  let p5_current_y = y_0 / media_per_unit;
  return { x: p5_current_x, y: p5_current_y };
}
