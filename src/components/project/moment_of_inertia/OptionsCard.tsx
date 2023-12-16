import { FC } from "react";
import { Link } from "react-router-dom";

interface OptionsCardProps {
  path: string;
  name: string;
  image: string;
  imageAlt: string; // Assuming imageAlt is a required prop, adjust accordingly
}

const OptionsCard: FC<OptionsCardProps> = ({ path, name, image, imageAlt }) => {
  return (
    <Link to={path}>
      <div className=" rounded-xl flex flex-col h-full justify-between  border-4 max-w-xs shadow-lg hover:shadow-2xl  transition ease-in-out">
        <img
          src={image}
          alt={imageAlt}
          height={200}
          width={200}
          className="m-auto  rounded-md "
        />
        <figcaption className="text-xl mx-auto font-semibold text-center mb-4">
          {name}
        </figcaption>
      </div>
    </Link>
  );
};

export default OptionsCard;
