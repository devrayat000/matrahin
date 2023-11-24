import Vector from "~/lib/vector";
import VectorDisplay from "../vector/VectorDisplay";

export interface UmbrellaStepsProps {
  object: {
    velocity: number;
    angle: number;
  };
  rain: {
    velocity: number;
    angle: number;
  };
  wind: {
    velocity: number;
    angle: number;
  };
  umbrella: {
    angle: number;
    relativeVelocity: number;
  };
}

type StepList<P> = React.FC<P>[];

const UmbrellaSteps: StepList<UmbrellaStepsProps> = [
  ({ rain, object, wind }) => {
    const vRain = Vector.fromLine(rain.velocity, rain.angle - 90);
    const vObject = Vector.fromLine(object.velocity, object.angle);
    const vWind = Vector.fromLine(wind.velocity, wind.angle);

    return (
      <div>
        <p className="text-base">Vectorize the components</p>
        <div>
          Rain vector, V<sub>r</sub> = <VectorDisplay vector={vRain} />
        </div>
        <div>
          Object vector, V<sub>o</sub> = <VectorDisplay vector={vObject} />
        </div>
        <div>
          Wind vector, V<sub>w</sub> = <VectorDisplay vector={vWind} />
        </div>
      </div>
    );
  },
  ({ wind, object }) => {
    const vObject = Vector.fromLine(object.velocity, object.angle);
    const vWind = Vector.fromLine(wind.velocity, wind.angle);
    const vR = Vector.sub(vObject, vWind);
    return (
      <div>
        Object relative to wind, V<sub>R</sub> = <VectorDisplay vector={vR} />
      </div>
    );
  },
  ({ wind, object, rain }) => {
    const vRain = Vector.fromLine(rain.velocity, rain.angle - 90);
    const vObject = Vector.fromLine(object.velocity, object.angle);
    const vWind = Vector.fromLine(wind.velocity, wind.angle);
    const vR = Vector.sub(vObject, vWind);
    const vr = Vector.sub(vRain, vR);

    return (
      <div>
        Rain relative to object, V<sub>R</sub> = <VectorDisplay vector={vr} />
      </div>
    );
  },
  ({ wind, object, rain }) => {
    const vRain = Vector.fromLine(rain.velocity, rain.angle - 90);
    const vObject = Vector.fromLine(object.velocity, object.angle);
    const vWind = Vector.fromLine(wind.velocity, wind.angle);
    const vR = Vector.sub(vObject, vWind);
    const vr = Vector.sub(vRain, vR);
    const angle = 180 - Vector.angle(vr, new Vector([0, 1, 0]));

    return (
      <div>
        Angle of rain relative to object, α ={" "}
        {angle.toLocaleString(undefined, { maximumFractionDigits: 2 })}&deg;
      </div>
    );
  },
];

export default UmbrellaSteps;
