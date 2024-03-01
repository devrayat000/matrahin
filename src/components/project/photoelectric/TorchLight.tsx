const TorchLight = ({ color }: { color: string }) => {
  return (
    <g viewBox="0 0 500 500">
      <path d="M 150 200 Q 115 250 150 300" stroke="black" fill="transparent" />
      <path d="M 150 200 Q 185 250 150 300" stroke="black" fill={color} />
      <path d="M 180 200 Q 215 250 180 300" stroke="black" fill="transparent" />
      <line x1="150" x2="180" y1="200" y2="200" />
      <line x1="150" x2="180" y1="300" y2="300" />
      <line x1="180" x2="240" y1="200" y2="220" />
      <line x1="180" x2="240" y1="300" y2="280" />

      <path d="M 240 220 Q 255 250 240 280" stroke="black" fill="transparent" />
      <line x1="240" x2="365" y1="220" y2="220" />
      <line x1="240" x2="365" y1="280" y2="280" />

      {/* <path d="M 400 220 Q 435 250 400 280" stroke="black" fill="transparent" /> */}
      <path d="M 365 220 Q 380 250 365 280" stroke="black" fill="transparent" />
      {/* <path d="M 400 220 Q 365 250 400 280" stroke="black" fill="transparent" /> */}
    </g>
  );
};

export default TorchLight;
