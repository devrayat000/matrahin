declare module "*.svg" {
  const SVG: import("react").VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module "*.svg?url" {
  const content: import("next/image").StaticImageData;
  export default content;
}
