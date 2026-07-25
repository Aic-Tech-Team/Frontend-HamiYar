import type { TypewriterClass, Options } from "typewriter-effect";

declare module "typewriter-effect/dist/core" {
  const Typewriter: new (container: string | HTMLElement, options?: Options) => TypewriterClass;
  export default Typewriter;
}