import {
  IconBrandGithub,
  IconBrandTwitter,
  IconMail,
  IconBook,
  IconBrandInstagram,
  IconBrandLinkedin,

  IconMapPin,

} from "@tabler/icons-react"
import { Button } from "./ui/button"

export default function FooterDemo() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about-us" },
      { name: "Careers", href: "mailto:hi@zentha.in" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/policies/privacy-policy" },
      { name: "Terms of Service", href: "/policies/terms-and-conditions" },
      { name: "Refund Policy", href: "/policies/refund-cancellation" },
    ],
    support: [
      { name: "Contact Us", href: "mailto:hi@zentha.in" },
      { name: "FAQ", href: "/faq" },
    ],
  }

  const socialLinks = [
    { name: "Twitter", icon: <IconBrandTwitter className="h-5 w-5" />, href: "https://x.com/iblameyuvraj" },
    { name: "Instagram", icon: <IconBrandInstagram className="h-5 w-5" />, href: "https://www.instagram.com/zenthastudio/" },
    { name: "LinkedIn", icon: <IconBrandLinkedin className="h-5 w-5" />, href: "https://www.linkedin.com/company/zenthaai/" },
    { name: "GitHub", icon: <IconBrandGithub className="h-5 w-5" />, href: "https://github.com/iblameyuvraj" },
  ]

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <IconBook className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold">Zentha Notes</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your comprehensive platform for educational resources, study materials, and academic excellence.
            </p>
            <div className="space-y-2">

              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <IconMail className="h-4 w-4" />
                <span>hi@zentha.in</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <IconMapPin className="h-4 w-4" />
                <span>based in jaipur, india</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        {/* Social Media Section */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Section Title */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">Connect with us</h3>
              <p className="text-gray-400 text-sm">Follow us on social media for updates and news</p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="w-full border-t border-gray-800 mt-12"></div>
      </div>
    </footer>
  )
}
