declare module "*.svg" {
  import React from "react";
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module "*.svg?url" {
  import { StaticImageData } from "next/image";
  const urlString: StaticImageData;
  export default urlString;
}
