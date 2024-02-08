import { useAtomValue } from "jotai";
import { Chart } from "react-google-charts";
import { pointsAtom } from "./AnimationHelper";

const GraphsBasic = () => {
  const resultPoints = useAtomValue(pointsAtom);

  let data = [["time", "y"]];
  data.push(...resultPoints.map((point) => [point.t, point.y]));

  const options = {
    title: "Height vs Time ",
    // titlePosition: "in",
    titleTextStyle: {
      fontSize: 25,
      bold: true,
      italic: false,
      color: "black",
    },
    hAxis: {
      title: "Time (t)",
    },
    vAxis: {
      title: "Height (m)",
    },
    series: {
      0: { curveType: "function" },
    },
    legend: {
      position: "none",
    },
  };

  return (
    <div className="flex flex-col w-5/6 md:flex-row m-2 p-2      items-center justify-between  ">
      <div className=" md:w-1/2 ">
        <Chart
          chartType="LineChart"
          // width=""
          height={500}
          data={data}
          options={options}
        />
      </div>
      <div className="md:w-1/2 ">
        <Chart
          chartType="LineChart"
          // width="1000"
          height={500}
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default GraphsBasic;
