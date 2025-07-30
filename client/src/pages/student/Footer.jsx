import React from "react";

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="ml-2 text-xl font-bold font-serif">E-Learning</span>
            </div>
            <p className="text-gray-400">Building innovative solutions for the modern world.</p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              {[
                { label: "Facebook", icon: "facebook" },
                { label: "Twitter", icon: "twitter" },
                { label: "Instagram", icon: "instagram" },
                { label: "LinkedIn", icon: "linkedin" },
              ].map((social, idx) => (
                <a key={idx} href="#" className="text-gray-400 hover:text-white transition" aria-label={social.label}>
                  <span className="sr-only">{social.label}</span>
                  <i className={`fa-brands fa-${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About Us", "Services", "Pricing", "Blog"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-white transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              {["Web Development", "Mobile Apps", "UI/UX Design", "Digital Marketing", "Cloud Solutions"].map((service, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-white transition">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p>123 Business Ave</p>
              <p>San Francisco, CA 94107</p>
              <p className="mt-2">
                Email: <a href="mailto:info@company.com" className="hover:text-white transition">info@company.com</a>
              </p>
              <p>
                Phone: <a href="tel:+11234567890" className="hover:text-white transition">+1 (123) 456-7890</a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Company. All rights reserved.</p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item, i) => (
              <a key={i} href="#" className="text-gray-500 hover:text-white text-sm transition">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
