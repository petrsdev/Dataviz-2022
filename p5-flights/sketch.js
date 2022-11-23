let _flights;
let flights;

function preload() {
  _flights = loadTable('flights.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  const distances = _flights.getColumn('distance');
  const minDistance = min(distances);
  const maxDistance = max(distances);
  flights = _flights.getRows().map((_) => ({
    fx: map(_.getNum('from_long'), -180, 180, 0, width),
    fy: map(_.getNum('from_lat'), -90, 90, height, 0),
    tx: map(_.getNum('to_long'), -180, 180, 0, width),
    ty: map(_.getNum('to_lat'), -90, 90, height, 0),
    d: map(_.getNum('distance'), minDistance, maxDistance, 2, 10),
  }));
  colorMode(HSL);
  noLoop();
}

function draw() {
  background(10);
  noStroke();
  fill(240, 0, 60, 0.15);
  flights.forEach((flight) => {
    if (flight.active) {
      noStroke();
      circle(flight.fx, flight.fy, flight.d * 4);
      stroke(126);
      line(flight.fx, flight.fy, flight.tx, flight.ty);
    } else {
      noStroke();
      circle(flight.fx, flight.fy, flight.d);
    }
  });
}

function mouseClicked() {
  draw();
  flights.forEach((flight) => {
    if (dist(flight.fx, flight.fy, mouseX, mouseY) < 20) {
      fill(0, 90, 50, 0.5);
      circle(flight.tx, flight.ty, flight.d);
      fill(240, 80, 90, 0.15);
      circle(flight.fx, flight.fy, flight.d);
    }
  });
}

function mouseMoved() {
  console.log(`${mouseX} ${mouseY}`);
  flights.forEach((flight) => {
    flight.active = dist(flight.fx, flight.fy, mouseX, mouseY) < 20 ? true : false;
  });
  draw();
}
