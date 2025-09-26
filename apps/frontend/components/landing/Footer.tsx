import { Github, Heart, Linkedin, Mail, Twitter } from "lucide-react";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
  weight: "700",
  subsets: ["latin"],
});

export function Footer() {
  const socialLinks = [
    {
      icon: <Github className="w-6 h-6 hover:text-cyan-400 transition" />,
      href: "https://github.com/RitoG09",
      label: "GitHub",
    },

    {
      icon: (
        <Twitter className="w-6 h-6 text-cyan-400 hover:text-cyan-300 transition" />
      ),
      href: "https://x.com/RitoGhosh10",
      label: "Twitter",
    },
    {
      icon: (
        <Linkedin className="w-6 h-6 text-blue-400 hover:text-blue-500 transition" />
      ),
      href: "https://www.linkedin.com/in/ritog09/",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="w-full bg-neutral-950 text-white border-t border-neutral-800 py-5 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <text fontSize="50" fontWeight="600" fill="currentColor">
          Collab{" "}
          <tspan
            className={`${dancingScript.className} text-red-800 font-extrabold`}
            fontSize="25"
          >
            Draw
          </tspan>
        </text>
        <div className="flex gap-3 mt-4 md:mt-0">
          {socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="text-sm text-neutral-500">
          © {new Date().getFullYear()} CollabDraw. All rights reserved.
        </span>
        <span className="flex items-center gap-1 text-sm text-neutral-500">
          Made by <a className="text-red-800">Rito</a>
        </span>
      </div>
    </footer>
  );
}
