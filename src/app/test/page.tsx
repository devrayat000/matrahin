"use client";

import GraphsPhotoElectric from "./GraphsPhotoElectric";
import MainSimulation from "./MainSimulation";

const page = () => {
  return (
    <center className="flex flex-row gap-2 mt-3">
      <MainSimulation />
      <GraphsPhotoElectric />
    </center>
  );
};

export default page;
