declare module "typewriter-effect/dist/core" {
  import type { TypewriterClass, Options } from "typewriter-effect";

  const Typewriter: new (container: string | HTMLElement, options?: Options) => TypewriterClass;

  export default Typewriter;
}
