import Link from "next/link"

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-sans">
          About Us
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 font-serif">
          This app is built by <span className="font-semibold text-white"><a href="https://zentha.in" target="_blank" rel="noopener noreferrer">Zentha Studio</a></span>
        </p>
        <p className="text-lg md:text-xl text-gray-300 mb-6 font-serif">
          We help students save time by providing notes and study material, so you can study easily without any last-moment problems.
        </p>
        <p className="text-lg md:text-xl text-gray-300 mb-10 font-serif">
 If you want to support us,{" "}
          <Link
            href="https://razorpay.me/@iblameyuvrajj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
          >
            buy us a mold coffee ☕
          </Link>
        </p>
      </div>
    </main>
  )
}