"use client"
import { BookOpen, Cloud, Lock, Search, Sparkles } from "lucide-react"
import type React from "react"

import { GlowingEffect } from "@/components/ui/glowing-effect"

export default function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<BookOpen className="h-4 w-4 text-white/80" />}
        title={<span className="text-white">Format</span>}
        description={<span className="text-white/80">All documents are in pdf and images format.</span>}
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Search className="h-4 w-4 text-white/80" />}
        title={<span className="text-white">Smart Categorization</span>}
        description={<span className="text-white/80">You can only see the notes and pyq that are relevant to your semester and section.</span>}
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4 text-white/80" />}
        title={<span className="text-white">Secure & Private</span>}
        description={<span className="text-white/80">Your data and password are encrypted end-to-end. Only you can access your data.</span>}
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4 text-white/80" />}
        title={<span className="text-white">Ask AI</span>}
        description={<span className="text-white/80">Ask AI to understand your Notes, Pyq, Mid-term, by a simple click.</span>}
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Cloud className="h-4 w-4 text-white/80" />}
        title={<span className="text-white">Sync Everywhere</span>}
        description={<span className="text-white/80">Access your notes on any device with real-time synchronization across all platforms.</span>}
      />
    </ul>
  )
}

interface GridItemProps {
  area: string
  icon: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-white/10 bg-black/50 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900/50 to-black/50 p-6 md:p-6 border border-white/5 backdrop-blur-sm">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">{icon}</div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
