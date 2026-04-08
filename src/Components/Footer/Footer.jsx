import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" bg-transparent border-t border-gray-400 mt-10 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* Logo / About */}
          <div>
            <h2 className="text-xl font-bold text-heading mb-2">MySocialApp</h2>
            <p className="text-sm text-body max-w-xs">
              Connect with friends, share your thoughts, and explore the world.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10">
            <div>
              <h4 className="text-heading font-semibold mb-2">Links</h4>
              <ul className="space-y-1 text-sm text-body">
                <li className="hover:text-heading cursor-pointer">Home</li>
                <li className="hover:text-heading cursor-pointer">Profile</li>
                <li className="hover:text-heading cursor-pointer">Explore</li>
              </ul>
            </div>

            <div>
              <h4 className="text-heading font-semibold mb-2">Support</h4>
              <ul className="space-y-1 text-sm text-body">
                <li className="hover:text-heading cursor-pointer">Help Center</li>
                <li className="hover:text-heading cursor-pointer">Privacy</li>
                <li className="hover:text-heading cursor-pointer">Terms</li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-heading font-semibold mb-2">Follow Us</h4>
            <div className="flex gap-3">
              <span className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-indigo-500 hover:text-white cursor-pointer transition">
                <FaFacebookF />
              </span>
              <span className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-indigo-500 hover:text-white cursor-pointer transition">
                <FaTwitter />
              </span>
              <span className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-indigo-500 hover:text-white cursor-pointer transition">
                <FaInstagram />
              </span>
              <span className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-indigo-500 hover:text-white cursor-pointer transition">
                <FaLinkedinIn />
              </span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-5 border-t border-gray-700 text-center text-sm text-body">
          © {new Date().getFullYear()} MySocialApp. All rights reserved.
        </div>

      </div>
    </footer>
  );
}