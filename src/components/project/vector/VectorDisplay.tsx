import type Vector from "~/lib/vector";

function fix(number: number) {
  return number < 0 ? -number : number;
}

function sign(number: number) {
  return number < 0 ? "-" : "+";
}

export default function VectorDisplay({ vector }: { vector: Vector }) {
  return (
    <span>
      {sign(vector.x) === "+" ? "" : "-"}
      <span>
        {fix(vector.x).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        <b>i</b>
      </span>
      {sign(vector.y)}
      <span>
        {fix(vector.y).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        <b>j</b>
      </span>
      {sign(vector.z)}
      <span>
        {fix(vector.z).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        <b>k</b>
      </span>
    </span>
  );
}
