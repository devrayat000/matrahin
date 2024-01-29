import RainInput from "../RainInput";
import ResultBasic from "./ResultBasic";

const page = () => {
  return (
    <>
      <RainInput wind={false} />
      <ResultBasic />
    </>
  );
};

export default page;
