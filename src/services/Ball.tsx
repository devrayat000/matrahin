export default class Ball {
  x: number;
  y: number;
  v: number;
  theta: number;
  r: number;
  img: string;
  vx: number;
  vy: number;
  cx: number;
  cy: number;
  positions: number[][];
  velocities: number[];
  accelerations: number[];
  ctx: CanvasRenderingContext2D;
  g: number;
  drag: number;

  constructor(
    x: number,
    y: number,
    v: number,
    theta: number,
    r: number,
    img: string,
    ctx: CanvasRenderingContext2D,
    g: number,
    drag?: number
  ) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.theta = theta;
    this.r = r;
    this.img = img;
    const vx = v * Math.cos((theta / 180) * Math.PI);
    const vy = -v * Math.sin((theta / 180) * Math.PI);
    this.vx = vx;
    this.vy = vy;
    this.cx = x + r / 2;
    this.cy = y + r / 2;
    this.positions = [];
    this.velocities = [];
    this.accelerations = [];
    this.ctx = ctx;
    this.g = g;
    this.drag = drag || 0;
  }

  drawAngleLines() {
    const ctxP = this.ctx;
    ctxP.beginPath();

    ctxP.setLineDash([2, 3]);
    ctxP.moveTo(this.x + 2, this.y + this.r / 2);
    ctxP.lineTo(this.x + 150, this.y + this.r / 2);
    ctxP.stroke();
    ctxP.setLineDash([1, 0]);
  }

  draw() {
    const ctxP = this.ctx;
    // const cWP = ctxP.canvas.width;
    // const cHP = ctxP.canvas.height;
    // const vscale = 3;
    const ballImg = new Image();
    ballImg.src = this.img;
    ctxP.drawImage(ballImg, this.x, this.y, this.r, this.r);
    // if (showVectors)
    //   drawArrow(
    //     ctxP,
    //     this.cx,
    //     this.cy,
    //     this.cx + this.vx * vscale,
    //     this.cy + this.vy * vscale
    //   );
  }

  move() {
    const scale = 0.2;
    const G = (this.g * scale) / 10;
    const drag = this.drag;
    const angle = Math.atan2(this.vy, this.vx);

    this.vx -= drag * Math.cos((angle / 180) * Math.PI) * this.vx * this.vx;
    this.x += this.vx * 0.5 * scale;

    this.vy += G - drag * Math.sin(angle) * this.vy * this.vy;
    this.y += this.vy * 0.5 * scale;
    this.cx = this.x + this.r / 2;
    this.cy = this.y + this.r / 2;
    this.positions.push([this.x + this.r / 2, this.y + this.r / 2]);
    this.velocities.push(this.vy);
    const a = drag * Math.sin(angle) * this.vy * this.vy;
    this.accelerations.push(a);
  }
}
