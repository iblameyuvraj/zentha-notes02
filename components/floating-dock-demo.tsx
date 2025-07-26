import { FloatingDock } from "@/components/ui/floating-dock"
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconHome,
  IconMail,
  IconBook,
  IconHelp,
  IconSettings,
  IconBrandInstagram,
} from "@tabler/icons-react"

export default function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-6 w-6 text-white" />,
      href: "#",
    },
    {
      title: "How to Use",
      icon: <IconHelp className="h-6 w-6 text-white" />,
      href: "#how-to-use",
    },
    {
      title: "Features",
      icon: <IconBook className="h-6 w-6 text-white" />,
      href: "#features",
    },
    {
      title: "Contact",
      icon: <IconMail className="h-6 w-6 text-white" />,
      href: "#contact",
    },
    {
      title: "Instagram",
      icon: <IconBrandInstagram className="h-6 w-6 text-white" />,
      href: "https://instagram.com/",
    },
  ]

  return (
    <div className="flex items-center justify-center h-[10rem] w-full">
      <FloatingDock mobileClassName="translate-y-20" items={links} />
    </div>
  )
}
