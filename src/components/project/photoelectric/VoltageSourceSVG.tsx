const VoltageSource = ({
  size,
  plusLeft,
}: {
  size: number;
  plusLeft: boolean;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={4}
      transform={
        plusLeft ? "translate(10 0)" : "translate(30 0) rotate(180 35 35)"
      }
    >
      <Line num={[10, 30, 35, 35]} />
      <Line num={[30, 30, 10, 60]} />
      <Line num={[40, 40, 25, 45]} />
      <Line num={[50, 50, 10, 60]} />
      <Line num={[60, 60, 25, 45]} />
      <Line num={[60, 85, 35, 35]} />
    </svg>
  );
};

const Line = ({ num }: { num: number[] }) => {
  return <line x1={num[0]} x2={num[1]} y1={num[2]} y2={num[3]} />;
};

export default VoltageSource;
