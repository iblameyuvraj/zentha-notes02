import NavbarDemo from "@/components/resizable-navbar-demo"
import FlipWordsDemo from "@/components/flip-words-demo"
import GlowingEffectDemo from "@/components/glowing-effect-demo"
import FloatingDockDemo from "@/components/floating-dock-demo"
import GoogleGeminiEffectDemo from "@/components/google-gemini-effect-demo"


export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <NavbarDemo />

      {/* Hero Section with Flip Words */}
      <section id="hero" className="relative bg-black">
        <FlipWordsDemo />
      </section>

      {/* How to Use Section with Google Gemini Effect */}
      <section id="how-to-use" className="relative">
        <GoogleGeminiEffectDemo />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Powerful Features of Zentha Notes
          </h2>
          <GlowingEffectDemo />
        </div>
      </section>

      {/* Remove WavyBackground and Why Choose Zentha sections */}

      {/* Footer with Floating Dock */}
      <footer className="py-20 bg-black">
        <FloatingDockDemo />
        <div className="text-center mt-8">
          <p className="text-neutral-400">© {new Date().getFullYear()} Zentha Notes. Made by <a href="https://zentha.in" className="text-white">zentha studio.</a></p>
        </div>
      </footer>
    </div>
  )
}
