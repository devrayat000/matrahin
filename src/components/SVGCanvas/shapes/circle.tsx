import { useAtomValue } from "jotai";
import { scaleAtom } from "../store";
import { ShapeProps } from "./shapeProps";

interface CircleProps extends ShapeProps, React.SVGProps<SVGCircleElement> {}

const Circle: React.FC<CircleProps> = ({ sizeFixed, ...props }) => {
  const scale = useAtomValue(scaleAtom);
  const { cx, cy, r, fill } = props;

  console.log(scale, Number(cx) * scale);
  return (
    <circle
      cx={Number(cx) * scale}
      cy={-Number(cy) * scale}
      r={Number(r) * (sizeFixed ? 1 : scale)}
      fill={fill}
      {...props}
    />
  );
};

export default Circle;
