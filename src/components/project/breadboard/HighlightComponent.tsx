import { Coordinate } from "../equi-resistance/store";

/**
 * Renders a line component with highlighting functionality.
 *
 * @example
 * ```tsx
 * <HighlightComponent
 *  start={{ x: 0, y: 0 }}
 *  end={{ x: 100, y: 100 }}
 *  isHighlighted={true}
 * />
 * ```
 *
 * @param start - The starting coordinate of the line.
 * @param end - The ending coordinate of the line.
 * @param isHighlighted - Indicates whether the line should be highlighted.
 * @returns The rendered line component.
 */
const HighlightComponent = ({
  start,
  end,
  isHighlighted,
}: {
  start: Coordinate;
  end: Coordinate;
  isHighlighted: boolean;
}) => {
  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      strokeWidth={20}
      stroke="blue"
      opacity={isHighlighted ? 0.25 : 0}
      strokeLinecap="round"
    />
  );
};

export default HighlightComponent;
