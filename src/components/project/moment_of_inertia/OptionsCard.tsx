import Image, { StaticImageData } from "next/image";

interface OptionsCardProps {
  name: string;
  image: StaticImageData;
  imageAlt: string; // Assuming imageAlt is a required prop, adjust accordingly
}

const OptionsCard: React.FC<OptionsCardProps> = ({ name, image, imageAlt }) => {
  return (
    <div className="rounded-xl flex flex-col h-full justify-between border-4 max-w-xs shadow-lg hover:shadow-2xl transition ease-in-out">
      <Image
        {...image}
        alt={imageAlt}
        height={200}
        width={200}
        className="m-auto rounded-md "
      />
      <figcaption className="text-xl mx-auto font-semibold text-center mb-4">
        {name}
      </figcaption>
    </div>
  );
};

export default OptionsCard;
