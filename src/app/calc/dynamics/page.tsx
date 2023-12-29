"use client";

import { useAtomValue, useStore } from "jotai";
import { RESET } from "jotai/utils";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  accelerationAtom,
  completedAtom,
  displacementAtom,
  finalVelocityAtom,
  initialVelocityAtom,
  timeAtom,
  useAtomChanger,
  useRoundedAtomValue,
} from "~/components/project/dynamics/store";

export default function DynamicsPage() {
  const completed = useAtomValue(completedAtom);
  const store = useStore();

  function reset() {
    store.set(displacementAtom, RESET);
    store.set(initialVelocityAtom, RESET);
    store.set(finalVelocityAtom, RESET);
    store.set(accelerationAtom, RESET);
    store.set(timeAtom, RESET);
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
            onChange={useAtomChanger(displacementAtom)}
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
            onChange={useAtomChanger(initialVelocityAtom)}
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
            onChange={useAtomChanger(finalVelocityAtom)}
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
            onChange={useAtomChanger(accelerationAtom)}
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
            onChange={useAtomChanger(timeAtom)}
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
