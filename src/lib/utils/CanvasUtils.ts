/**
 *
 * @param {CanvasRenderingContext2D} context
 * @param {object} from object as {x,y} of initial position
 * @param {object} to  object as {x,y} of initial position
 * @param {number} radius size of the arrow head
 * @param {string} color color of the arrow
 */

export default function drawArrow(
  context: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  radius: number,
  color: string = "black",
  isDotted: boolean = false
) {
  context.fillStyle = color;
  // Calculate the arrow direction
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  // Draw the line
  context.beginPath();
  if (isDotted) {
    context.setLineDash([5, 5]);
  }
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
  context.closePath();
  context.setLineDash([]);

  // Draw the arrowhead
  context.beginPath();
  context.moveTo(to.x, to.y);
  context.lineTo(
    to.x - radius * Math.cos(angle - Math.PI / 6),
    to.y - radius * Math.sin(angle - Math.PI / 6)
  );
  context.lineTo(
    to.x - radius * Math.cos(angle + Math.PI / 6),
    to.y - radius * Math.sin(angle + Math.PI / 6)
  );
  context.closePath();
  context.fill();
}

/**
 *
 * @param {context} context
 * @param {object} from
 * @param {number} angle
 * @param {number} length
 * @param {number} radius
 * @param {string} color
 */

export const drawArrowByAngle = (
  context: CanvasRenderingContext2D,
  from: { x: number; y: number },
  angle: number,
  length: number,
  radius: number,
  color: string
) => {
  context.fillStyle = color;
  // Calculate the arrow direction
  const dx = length * Math.cos(angle);
  const dy = -length * Math.sin(angle);

  // Draw the line
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(from.x + dx, from.y + dy);
  context.stroke();

  // Calculate arrowhead angles
  const arrowAngle1 = angle + Math.PI / 6;
  const arrowAngle2 = angle - Math.PI / 6;

  // Draw the arrowhead
  context.beginPath();
  context.moveTo(from.x + dx, from.y + dy);
  context.lineTo(
    from.x + dx - radius * Math.cos(arrowAngle1),
    from.y + dy + radius * Math.sin(arrowAngle1)
  );
  context.lineTo(
    from.x + dx - radius * Math.cos(arrowAngle2),
    from.y + dy + radius * Math.sin(arrowAngle2)
  );

  context.closePath();
  context.fill();
};

export type velocityType = {
  magnitude: number;
  angle: number;
};

const velocityColors = [
  "red",
  "green",
  "blue",
  "purple",
  "brown",
  "orange",
  "yellow",
  "pink",
  "cyan",
  "magenta",
  "lime",
  "teal",
  "indigo",
  "maroon",
  "navy",
  "olive",
  "silver",
  "aqua",
  "fuchsia",
  "gray",
];

// todo: check if index < velocityColors.length
/**
 * @brief Renders the velocity arrows on the canvas
 *
 * @param ctx context of the canvas
 * @param currentPosition
 * @param velocities [{magnitude, angle (in degrees)}]
 *
 */
export const renderVelocityArrows = (
  ctx: CanvasRenderingContext2D,
  currentPosition: { x: number; y: number },
  velocities: velocityType[]
) => {
  // draw all the arrows
  velocities.forEach(({ magnitude, angle }: velocityType, index: number) => {
    if (Math.abs(magnitude - 0) >= 0.01)
      drawArrowByAngle(
        ctx,
        currentPosition,
        (angle * Math.PI) / 180,
        magnitude,
        15,
        velocityColors[index]
      );
  });
};

export const renderArcOfAngle = (
  ctx: CanvasRenderingContext2D,
  currentPosition: { x: number; y: number },
  resultantAngle: number,
  vx: number,
  character: string = "θ"
) => {
  // draw arc of angle
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(
    currentPosition.x,
    currentPosition.y,
    Math.min(35, vx),
    resultantAngle > 0 ? 0 : -resultantAngle,
    resultantAngle > 0 ? -resultantAngle : 0,
    true
  );
  ctx.stroke();
  ctx.closePath();

  // Draw the text (theta) just outside the arc

  const textX = currentPosition.x + 50; // Adjust the X-coordinate as needed
  const textY = currentPosition.y - (resultantAngle > 0 ? 20 : 10); // Keep it close to the arc
  ctx.font = "14px Arial"; // Adjust the font size and family as needed
  ctx.fillStyle = "black"; // Set the text color
  ctx.fillText(
    `${character}: ${((resultantAngle * 180) / Math.PI).toFixed(1)}°`,
    textX,
    textY
  );
};
