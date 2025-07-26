import { FlipWords } from "@/components/ui/flip-words"

export default function FlipWordsDemo() {
  const words = ["organized", "productive", "focused", "creative"]

  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-neutral-100 dark:text-neutral-100 text-center">
        Take notes and stay
        <FlipWords words={words} /> <br />
        with Zentha Notes
      </div>
    </div>
  )
}
