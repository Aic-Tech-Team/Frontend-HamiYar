/// <reference types="vite/client" />

declare module "typewriter-effect/dist/core" {
  import type { Options, TypewriterClass } from "typewriter-effect";

  const Typewriter: new (
    container: string | HTMLElement,
    options?: Options,
  ) => TypewriterClass;

  export default Typewriter;
}
