import { GlowingEffect } from "@/components/ui/glowing-effect"

export default function GlowingEffectDemo() {
  return (
    <>
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        {/* ...existing GridItems... */}
      </ul>
      {/* Glowing Border Effect Showcase */}
      <div className="mt-12 flex flex-wrap gap-8 justify-center items-center">
        {/* Default multi-color glowing border */}
        <div className="relative w-[340px] h-[180px] rounded-2xl bg-neutral-900 flex items-center justify-center">
          <GlowingEffect
            borderWidth={3}
            blur={8}
            inactiveZone={0.6}
            proximity={24}
            spread={40}
            variant="default"
            glow={false}
            className="rounded-2xl"
            disabled={false}
            movementDuration={1.2}
          />
          <div className="relative z-10 text-center text-white font-semibold text-lg px-6">
            Multi-color Glowing Border<br/>
            <span className="text-xs font-normal text-neutral-300">(interactive, hover/touch to activate)</span>
          </div>
        </div>
        {/* White glowing border, always on */}
        <div className="relative w-[340px] h-[180px] rounded-2xl bg-neutral-900 flex items-center justify-center">
          <GlowingEffect
            borderWidth={4}
            blur={12}
            inactiveZone={0.5}
            proximity={0}
            spread={60}
            variant="white"
            glow={true}
            className="rounded-2xl"
            disabled={false}
            movementDuration={2}
          />
          <div className="relative z-10 text-center text-white font-semibold text-lg px-6">
            White Glowing Border<br/>
            <span className="text-xs font-normal text-neutral-300">(always on)</span>
          </div>
        </div>
      </div>
    </>
  )
} 