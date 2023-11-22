import { useState } from "react";

import { useSetAtom } from "jotai";
import ResultsContainer from "~/components/project/boat_river/ResultsContainer";
import { boatRiverSchema } from "~/components/project/boat_river/schema";
import { boatRiverAtom } from "~/components/project/boat_river/store";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Boat_RiverInput, Boat_River_General } from "~/services/Boat_River";

export default function BoatRiverPage() {
  const [initialState, setInitialState] = useState(boatRiverSchema[0]);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [error, setError] = useState<boolean>(false);
  const [angleGiven, setAngleGiven] = useState<boolean>(false);
  const [mode, setMode] = useState<"general" | "min_path">("general");
  const setBoatRiverParams = useSetAtom(boatRiverAtom);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const boatRiverGeneral = new Boat_River_General(
      inputs as unknown as Boat_RiverInput,
      angleGiven ? "general" : mode
    );
    try {
      boatRiverGeneral.solve();
    } catch (error) {
      console.log(error);
      setError(true);
      return;
    }
    setBoatRiverParams({ ...boatRiverGeneral });
  }

  /**
   * @description if velocity of boat is less than velocity of stream,
   * then it is not possible to cross the river in shortest distance
   */
  if (error && !angleGiven) {
    return (
      <div className="mt-10 min-h-screen flex flex-col items-center gap-4">
        <p className="text-red-800">
          Can't reach other end in shortest distance please provide initial
          angle to calculate
        </p>
        <Button
          className="justify-self-end"
          onClick={() => {
            setError(false);
            setInitialState(boatRiverSchema[1]);
            setAngleGiven((prev) => !prev);
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 my-4">
      <h1 className="text-2xl font-bold">Boat-River Problem</h1>
      <form
        className="w-[32rem] p-5 rounded-lg border-slate-200 border"
        onSubmit={onSubmit}
      >
        <Select
          name="initialParams"
          value={initialState.name}
          onValueChange={(value) => {
            setBoatRiverParams(undefined);
            setAngleGiven((prev) => !prev);
            setInitialState(
              (prev) =>
                boatRiverSchema.find((state) => state.name === value) || prev
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Known Parameters" />
          </SelectTrigger>
          <SelectContent>
            {boatRiverSchema.map((schema) => (
              <SelectItem key={schema.name} value={schema.name}>
                <div dangerouslySetInnerHTML={{ __html: schema.label }} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-6 flex flex-col gap-2">
          {initialState.fields.map((field) => (
            <div className="flex items-center" key={field.name}>
              <Label
                className="flex-1"
                htmlFor={field.name}
                dangerouslySetInnerHTML={{ __html: field.label }}
              />
              <Input
                id={field.name}
                name={field.name}
                className="flex-[16rem]"
                type={field.type}
                value={inputs[field.name] || 0}
                onChange={(e) =>
                  setInputs({ ...inputs, [field.name]: +e.currentTarget.value })
                }
              />
            </div>
          ))}

          {!angleGiven && (
            <Select
              name="mode"
              value={mode}
              onValueChange={(value: "general" | "min_path") => {
                setMode(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"general"}>
                  <div dangerouslySetInnerHTML={{ __html: "Shortest Time" }} />
                </SelectItem>
                <SelectItem value={"min_path"}>
                  <div
                    dangerouslySetInnerHTML={{ __html: "Shortest Distance" }}
                  />
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button
            className="justify-self-end"
            disabled={Object.keys(inputs).length < (angleGiven ? 4 : 3)}
          >
            Calculate
          </Button>
        </div>
      </form>
      <ResultsContainer />
    </div>
  );
}
