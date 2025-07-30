"use client"
import React from "react"
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/ui/text-reveal-card"

export default function TextRevealCardDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-2 sm:px-0 w-full">
      <TextRevealCard
        text="Zentha Notes"
        revealText="ALL IN ONE"
      >
        <TextRevealCardTitle>How to Use Zentha Notes</TextRevealCardTitle>
        <TextRevealCardDescription>
          Scroll or move your mouse over the card to reveal powerful features and learn how to master your workflow with Zentha Notes.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  )
}
