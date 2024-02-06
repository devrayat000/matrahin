import { useAtom } from "jotai";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import InputWithSlider from "~/components/ui/input-with-slider";
import Pendulum from "./Pendulum";
import { inputOptions, pendulumStore } from "./store";

const PendulumInputs = ({
  pendulumRef,
}: {
  pendulumRef: React.RefObject<Pendulum>;
}) => {
  const [length, setLength] = useAtom(pendulumStore.lengthAtom);
  const [mass, setMass] = useAtom(pendulumStore.massAtom);
  const [gravity, setGravity] = useAtom(pendulumStore.gravityAtom);
  const [angle, setAngle] = useAtom(pendulumStore.angleAtom);
  const [isPlaying, setIsPlaying] = useAtom(pendulumStore.isPlayingAtom);

  const values = useMemo(() => {
    return {
      length,
      mass,
      gravity,
      angle,
    };
  }, [length, mass, gravity, angle]);

  const calculateResults = (
    angle: number,
    length: number,
    mass: number,
    gravity: number
  ) => {
    pendulumRef.current?.setValue("angle", Number((angle * Math.PI) / 180));
    pendulumRef.current?.setValue("length", Number(length));
    pendulumRef.current?.setValue("mass", Number(mass));
    pendulumRef.current?.setValue("gravity", Number(gravity));
  };

  const handleChangeInput = (id: number, value: string) => {
    setIsPlaying(false);
    switch (id) {
      case 1:
        setAngle(Number(value));
        break;
      case 2:
        setLength(Number(value));
        break;
      case 3:
        setMass(Number(value));
        break;
      case 4:
        setGravity(Number(value));
        break;
    }
    calculateResults(angle, length, mass, gravity);
  };

  return (
    <div className="w-full mx-auto self-start">
      {inputOptions &&
        inputOptions.map((option, index) => (
          <InputWithSlider
            key={index}
            label={option.label}
            value={values[option.valueText]}
            id={option.id}
            helperText={option.helperText}
            onChangeInput={handleChangeInput}
            min={option.min}
            max={option.max}
          />
        ))}

      <center>
        <Button
          disabled={isPlaying}
          onClick={() => {
            calculateResults(angle, length, mass, gravity);
            setIsPlaying(true);
          }}
          className="w-[100px]"
        >
          Calculate
        </Button>
      </center>
    </div>
  );
};

export default PendulumInputs;
