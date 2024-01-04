import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface OptionsCardProps {
  path: string;
  name: string;
  image: StaticImageData;
  imageAlt: string; // Assuming imageAlt is a required prop, adjust accordingly
}

const OptionsCard: React.FC<OptionsCardProps> = ({
  path,
  name,
  image,
  imageAlt,
}) => {
  return (
    <Link href={`/calc/moi/${path}`}>
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
    </Link>
  );
};

export default OptionsCard;
