"use client";

import GraphsPhotoElectric from "~/components/project/photoelectric/GraphsPhotoElectric";
import MainSimulation from "~/components/project/photoelectric/MainSimulation";

const page = () => {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center">Photoelectric Effect</h1>
      <center className="flex flex-col h-fit md:flex-row gap-2 items-start justify-center md:mt-3 px-3">
        <MainSimulation />
        <GraphsPhotoElectric />
      </center>
    </main>
  );
};

export default page;
