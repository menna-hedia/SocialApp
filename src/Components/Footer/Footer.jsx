import { Link } from "react-router-dom";
import { FaGithub, FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";
import { LuMail, LuMapPin } from "react-icons/lu";

const exploreLinks = [
  { to: "/home", label: "Home" },
  { to: "/profile", label: "My Profile" },
  { to: "/about", label: "About" },
];

const supportLinks = [
  { href: "mailto:mennaa7med4000@gmail.com?subject=Help", label: "Help Center" },
  { href: "mailto:mennaa7med4000@gmail.com?subject=Feedback", label: "Send Feedback" },
  { href: "mailto:mennaa7med4000@gmail.com?subject=Report", label: "Report a Problem" },
];

const socials = [
  { href: "https://github.com/menna-hedia", label: "GitHub", icon: FaGithub },
  { href: "https://linkedin.com/in/menna-hedia-1176b924b", label: "LinkedIn", icon: FaLinkedinIn },
  { href: "https://www.instagram.com/menna_a7med._", label: "Instagram", icon: FaInstagram },
  { href: "https://www.facebook.com/menna.ahmed.605580", label: "Facebook", icon: FaFacebookF },
];

const headingClass = "mb-3 font-semibold text-gray-900";
const linkClass = "transition hover:text-indigo-500";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white text-gray-600 px-10">
      <div className="mx-auto max-w-[1500px] px-4 py-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* about */}
          <div>
            <h2 className="mb-3 text-xl font-bold text-indigo-500">MySocialApp</h2>
            <p className="text-sm leading-relaxed">
              A place to connect with friends, share your thoughts and photos, follow people you
              like, and discover what is happening around you. Join the conversation, react to
              posts, and build your own community.
            </p>

            <div className="mt-4 flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full bg-gray-100 p-2.5 text-gray-700 transition hover:bg-indigo-500 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* explore */}
          <div>
            <h4 className={headingClass}>Explore</h4>
            <ul className="space-y-2 text-sm">
              {exploreLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* support */}
          <div>
            <h4 className={headingClass}>Support</h4>
            <ul className="space-y-2 text-sm">
              {supportLinks.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className={linkClass}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className={headingClass}>Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <LuMail className="shrink-0 text-lg text-indigo-500" />
                <a href="mailto:mennaa7med4000@gmail.com" className={`break-all ${linkClass}`}>
                  mennaa7med4000@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <LuMapPin className="shrink-0 text-lg text-indigo-500" />
                <span>Menofia, Egypt</span>
              </li>
            </ul>
            <p className="mt-4 text-sm">
              Have an idea or found a bug? We would love to hear from you.
            </p>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-5 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} MySocialApp. All rights reserved.</p>
          <p>
            Built with React, Vite, and Tailwind CSS by{" "}
            <a
              href="https://github.com/menna-hedia"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-500 hover:underline"
            >
              Menna Hedia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}