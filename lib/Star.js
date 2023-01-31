let rgb = ['#B32BD9', '#3DBFF2', '#F2E205', '#F29F05', '#BF3111', '#044389'];
import getRandomInt from './GetRandInt.js';

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

export default class Star {
  constructor(context, mouse) {
    this.ctx = context;
    this.branches = getRandomInt(3, 9);
    this.startAngle = 0;
    this.color = rgb[getRandomInt(0, rgb.length - 1)];
    this.start = {
      x: mouse.x + getRandomInt(-20, 20),
      y: mouse.y + getRandomInt(-20, 20),
      length: getRandomInt(30, 45),
    };
    this.end = {
      x: this.start.x + getRandomInt(-300, 300),
      y: this.start.y + getRandomInt(-300, 300),
    };
    this.x = this.start.x;
    this.y = this.start.y;
    this.length = this.start.length;

    this.time = 0;
    this.ttl = 96;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    for (var i = 0; i < this.branches; i++) {
      this.ctx.lineTo(
        this.x +
          this.length *
            Math.cos(this.startAngle + (i * 2 * Math.PI) / this.branches),
        this.y +
          this.length *
            Math.sin(this.startAngle + (i * 2 * Math.PI) / this.branches)
      );
      this.ctx.lineTo(
        this.x +
          (this.length / 2) *
            Math.cos(
              this.startAngle + ((i + 0.5) * 2 * Math.PI) / this.branches
            ),
        this.y +
          (this.length / 2) *
            Math.sin(
              this.startAngle + ((i + 0.5) * 2 * Math.PI) / this.branches
            )
      );
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  update() {
    if (this.time <= this.ttl) {
      this.length = 0;
      let progress = 1 - (this.ttl - this.time) / this.ttl;
      this.length = this.start.length * (1 - easeOutQuart(progress));
      this.x = this.x + (this.end.x - this.x) * 0.012;
      this.y = this.y + (this.end.y - this.y) * 0.012;
    }
    this.time++;
  }
}
