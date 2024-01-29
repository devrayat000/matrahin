import RainInput from "./RainInput";
import Result from "./Result";

const page = () => {
  return (
    <>
      <RainInput wind={true} />
      <Result />
    </>
  );
};

export default page;
