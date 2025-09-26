"use client";
import {
  BrainCircuit,
  Infinity,
  MessagesSquare,
  RectangleGogglesIcon,
  Repeat,
} from "lucide-react";
import { GlowingEffect } from "../ui/glowing-effect";
import { ReactNode } from "react";

export const Features = () => {
  return (
    <section id="features" className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={
              <Infinity className="h-4 w-4 text-black dark:text-yellow-800" />
            }
            title="Infinite Canvas, Infinite Ideas"
            desc="Pan and zoom without limits. Warning: you might forget where you started."
          />

          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={
              <RectangleGogglesIcon className="h-4 w-4 text-black dark:text-blue-800" />
            }
            title="Real-Time Collaboration"
            desc="Work together in perfect sync."
          />

          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={
              <BrainCircuit className="h-4 w-4 text-black dark:text-red-800" />
            }
            title="AI Summarization of Canvas"
            desc="Generates a neat text summary of everything you’ve drawn—for docs, sharing, or proving you were actually productive."
          />

          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={
              <Repeat className="h-4 w-4 text-black dark:text-green-800" />
            }
            title="Undo, Redo, Repeat"
            desc="Because mistakes happen. A lot. We won’t judge."
          />

          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={
              <MessagesSquare className="h-4 w-4 text-black dark:text-purple-800" />
            }
            title="Team Chat Inside"
            desc="Draw, discuss, and chit-chat in one place."
          />
        </ul>
      </div>
    </section>
  );
};

interface IGridItemProps {
  area: string;
  icon: ReactNode;
  title: string;
  desc: ReactNode;
}

export const GridItem = ({ area, icon, title, desc }: IGridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={70}
          glow={true}
          disabled={false}
          proximity={70}
          inactiveZone={0.02}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-700 p-3">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] dark:white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {desc}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
