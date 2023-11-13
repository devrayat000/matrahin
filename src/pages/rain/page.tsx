import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function RainManPage() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-4">
      <form
        className="w-[32rem] p-2 rounded-lg border-slate-200 border"
        // onSubmit={onSubmit}
      >
        <h2 className="text-2xl text-center">Umbrella Calculaltor</h2>
        <div className="mt-3 flex flex-col gap-4 rounded-[inherit]">
          <fieldset className="flex gap-2 border-2 p-2 border-slate-200 rounded-[inherit] relative">
            <legend>Rain</legend>
            <div className="flex-1">
              <Label htmlFor="g">Velocity</Label>
              <Input id="g" name="g" type="number" />
            </div>
            <div className="flex-1">
              <Label htmlFor="vi">Angle</Label>
              <Input id="vi" name="vi" type="number" />
            </div>
          </fieldset>
          <fieldset className="flex gap-2 border-2 p-2 border-slate-200 rounded-[inherit]">
            <legend>Object</legend>
            <div className="flex-1">
              <Label htmlFor="g">Velocity</Label>
              <Input id="g" name="g" type="number" />
            </div>
            <div className="flex-1">
              <Label htmlFor="vi">Angle</Label>
              <Input id="vi" name="vi" type="number" />
            </div>
          </fieldset>

          <Button className="justify-self-end">Calculate</Button>
        </div>
      </form>
    </div>
  );
}
