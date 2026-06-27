import type { Metadata } from "next"
import { WebglScrollShaderDemo } from "@/components/showcase/webgl-scroll-shader-demo"

export const metadata: Metadata = {
  title: "WebGL Scroll Shader",
  description:
    "A scroll-driven line mesh in hand-written GLSL: five states, with local swirl and heat that follow the cursor. No 3D library.",
}

export default function WebglScrollShaderPage() {
  return <WebglScrollShaderDemo />
}
