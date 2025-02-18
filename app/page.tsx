import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import Link from "next/link";
import { div } from "motion/react-client";
import { Scroll } from "./pages/scroll";
import { Globo } from "./pages/globo";
import { AnimatedPin } from "./pages/animated-pin";
import { Testimonial } from "./pages/testimonials";
import { Beams } from "./pages/beams";
import { Nav } from "./pages/nav";
import { Card } from "./pages/card";
import { Tab } from "./pages/tab";
import { Docks } from "./pages/docks";
import { Canvas } from "./pages/canvas";

export default function Home() {
  return (
    <div className="text-slate-700 xl">
      <Nav></Nav>
      {/* <Docks></Docks> */}
      {/* <Tab></Tab> */}
      {/* <h1> Hello World!</h1> */}
      <Scroll></Scroll>
      <Beams></Beams>
      <Card></Card>
      <AnimatedPin></AnimatedPin>
      {/* <Globo></Globo> */}
      {/* <Canvas></Canvas> */}
      {/* <Testimonial></Testimonial> */}
    </div>
  )
};