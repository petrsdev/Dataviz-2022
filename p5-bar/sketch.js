let values = null;
const marginLeft = 40;
const textMargin = 10;
const rectWidth = 40;

function setup() {
  values = Array.from({ length: 10 }, (_) => random(40, 200));
  createCanvas(windowWidth / 2, windowHeight / 2);
  colorMode(HSL);
  textAlign(CENTER);
  noLoop();
}

const colorNumber = 20;
function draw() {
  background(255);
  noStroke();
  values.forEach((_, i) => {
    let posX = map(i, 0, values.length, marginLeft, width);
    for (let j = 0; j < colorNumber; j++) {
      fill(i * 30, 30 + j * 5, 60);
      rect(posX, height - j * (_ / colorNumber), rectWidth, _ / colorNumber + 1);
    }
    text(round(_), posX + rectWidth / 2, height - _ - textMargin);
  });
}
