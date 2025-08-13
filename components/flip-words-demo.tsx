import { FlipWords } from "@/components/ui/flip-words"
import ParticlesBackground from "@/components/ui/particles-background"

export default function FlipWordsDemo() {
  const words = ["Notes", "Mid-term", "pyq"]

  return (
    <div className="h-[40rem] relative">
      <ParticlesBackground className="absolute inset-0" />

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <div className="text-center text-neutral-100 dark:text-neutral-100">
          <div className="text-4xl font-normal">
            Never miss your <FlipWords words={words} /> <br />
            we've got you covered.
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/signup"
              className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ease-in-out text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-8 py-3 rounded-xl bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 ease-in-out text-lg font-semibold shadow-md"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

