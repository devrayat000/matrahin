"use client";

import GraphsPhotoElectric from "./GraphsPhotoElectric";
import MainSimulation from "./MainSimulation";

const page = () => {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center">Photoelectric Effect</h1>
      <center className="flex flex-col h-fit md:flex-row gap-2 items-start justify-evenly mt-3">
        <MainSimulation />
        <GraphsPhotoElectric />
      </center>
      <p>hi</p>
    </main>
  );
};

export default page;
