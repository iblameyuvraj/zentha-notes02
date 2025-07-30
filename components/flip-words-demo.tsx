import { FlipWords } from "@/components/ui/flip-words"
import ParticlesBackground from "@/components/ui/particles-background"

export default function FlipWordsDemo() {
  const words = ["Notes", "Mid-term", "pyq"]

  return (
    <div className="h-[40rem] relative">
      <ParticlesBackground className="absolute inset-0" />
      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <div className="text-4xl mx-auto font-normal text-neutral-100 dark:text-neutral-100 text-center">
          Never miss your
          <FlipWords words={words} /> <br />
          we've got you covered.
        </div>
      </div>
    </div>
  )
}
