import React from "react"

const faqs = [
  {
    question: "What is Zentha Notes?",
    answer:
      "Zentha Notes is a platform by Zentha Studio that provides students with quality notes and study material to help them prepare efficiently.",
  },
  {
    question: "Is Zentha Notes free to use?",
    answer:
      "NO! We charege 49 INR per Semester for access to all notes and features.",
  },
  {
    question: "How can I support Zentha Notes?",
    answer: (
      <>
        You can support us by{" "}
        <a
          href="https://razorpay.me/@iblameyuvrajj"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 underline hover:text-yellow-300 font-bold"
        >
          buying us a mold coffee ☕
        </a>
        .
      </>
    ),
  },
  {
    question: "How do I contact Zentha Studio?",
    answer:
      "You can email us at hi@zentha.in or connect with us on our social media channels.",
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center font-sans">
          Frequently Asked Questions
        </h1>
        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-900 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-2 font-serif">{faq.question}</h2>
              <p className="text-gray-300 text-lg font-serif">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>)}