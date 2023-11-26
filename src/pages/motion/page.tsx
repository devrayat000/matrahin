import {
  atom,
  type PrimitiveAtom,
  type Atom,
  useSetAtom,
  useAtomValue,
  useStore,
} from "jotai";
import { atomWithReset, RESET } from "jotai/utils";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { a, s, t, u, v } from "~/components/project/dynamics/formulae";
import { Button } from "~/components/ui/button";

const displacementPrimitiveAtom = atomWithReset<number | "">("");
const initialVelocityPrimitiveAtom = atomWithReset<number | "">("");
const finalVelocityPrimitiveAtom = atomWithReset<number | "">("");
const accelerationPrimitiveAtom = atomWithReset<number | "">("");
const timePrimitiveAtom = atomWithReset<number | "">("");

const propsAtom = atom((get) => {
  return {
    s: get(displacementPrimitiveAtom),
    u: get(initialVelocityPrimitiveAtom),
    v: get(finalVelocityPrimitiveAtom),
    a: get(accelerationPrimitiveAtom),
    t: get(timePrimitiveAtom),
  };
});

// const dpChange = atomEffect(get => {})

const displacementAtom = atom((get) => {
  const { s: displacement, ...props } = get(propsAtom);
  if (displacement !== "") return displacement;
  return s(props);
});

const initialVelocityAtom = atom((get) => {
  const { u: initialVelocity, ...props } = get(propsAtom);
  if (initialVelocity !== "") return initialVelocity;
  return u(props);
});

const finalVelocityAtom = atom((get) => {
  const { v: finalVelocity, ...props } = get(propsAtom);
  if (finalVelocity !== "") return finalVelocity;
  return v(props);
});

const accelerationAtom = atom((get) => {
  const { a: acceleration, ...props } = get(propsAtom);
  if (acceleration !== "") return acceleration;
  return a(props);
});

const timeAtom = atom((get) => {
  const { t: time, ...props } = get(propsAtom);
  if (time !== "") return time;
  return t(props);
});

const completedAtom = atom((get) => {
  return (
    !!get(displacementAtom) &&
    !!get(initialVelocityAtom) &&
    !!get(finalVelocityAtom) &&
    !!get(accelerationAtom) &&
    !!get(timeAtom)
  );
});

function useAtomChanger(atom: PrimitiveAtom<number | "">) {
  const setAtom = useSetAtom(atom);

  return (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") return setAtom("");
    setAtom(event.target.valueAsNumber);
  };
}

function useRoundedAtomValue(atom: Atom<number | "">) {
  const val = useAtomValue(atom);

  return val === ""
    ? ""
    : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function DynamicsPage() {
  const completed = useAtomValue(completedAtom);
  const store = useStore();

  function reset() {
    store.set(displacementPrimitiveAtom, RESET);
    store.set(initialVelocityPrimitiveAtom, RESET);
    store.set(finalVelocityPrimitiveAtom, RESET);
    store.set(accelerationPrimitiveAtom, RESET);
    store.set(timePrimitiveAtom, RESET);
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <form className="w-[32rem] p-2 rounded-lg border-slate-200 border flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="displacement" className="flex-1">
            Displacement
          </Label>
          <Input
            className="basis-[70%]"
            type="number"
            disabled={completed}
            value={useRoundedAtomValue(displacementAtom)}
            onChange={useAtomChanger(displacementPrimitiveAtom)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="initialVelocity" className="flex-1">
            Initial Velocity
          </Label>
          <Input
            className="basis-[70%]"
            type="number"
            disabled={completed}
            value={useRoundedAtomValue(initialVelocityAtom)}
            onChange={useAtomChanger(initialVelocityPrimitiveAtom)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="finalVelocity" className="flex-1">
            Final Velocity
          </Label>
          <Input
            className="basis-[70%]"
            type="number"
            disabled={completed}
            value={useRoundedAtomValue(finalVelocityAtom)}
            onChange={useAtomChanger(finalVelocityPrimitiveAtom)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="acceleration" className="flex-1">
            Acceleration
          </Label>
          <Input
            className="basis-[70%]"
            type="number"
            disabled={completed}
            value={useRoundedAtomValue(accelerationAtom)}
            onChange={useAtomChanger(accelerationPrimitiveAtom)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="time" className="flex-1">
            Time
          </Label>
          <Input
            className="basis-[70%]"
            type="number"
            disabled={completed}
            value={useRoundedAtomValue(timeAtom)}
            onChange={useAtomChanger(timePrimitiveAtom)}
          />
        </div>
        <Button
          variant="destructive"
          className="w-full"
          disabled={!completed}
          onClick={reset}
        >
          Reset
        </Button>
      </form>
    </div>
  );
}
