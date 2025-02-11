import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import Link from "next/link";
import { div } from "motion/react-client";
import { Scroll } from "./scroll";

export default function Home() {
  return (
    <div className="text-slate-700 xl">
      <h1> Hello World!</h1>
      <Scroll></Scroll>
    </div>
  )
};