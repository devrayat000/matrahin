"use client";

import { useState } from "react";
import InputSliderControl from "~/components/ui/input-slider-control";

const page = () => {
  const [value, setValue] = useState(10);

  return (
    <div className="w-72">
      <InputSliderControl
        label="asf"
        value={value}
        onChange={(num) => setValue(num)}
      />
    </div>
  );
};

export default page;
