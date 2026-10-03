import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy border-t-2 border-navy text-cream mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-coral border-2 border-cream rounded-lg flex items-center justify-center">
                <span className="font-fredoka font-700 text-white text-sm">D</span>
              </div>
              <span className="font-fredoka font-700 text-xl text-cream">DAAN IITG</span>
            </div>
            <p className="font-nunito text-sm text-cream/80 leading-relaxed">
              Dakshana Alumni Network — IIT Guwahati.
              <br />
              Connecting scholars, building futures.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-fredoka font-600 text-base text-yellow mb-3">Quick Links</h4>
            <ul className="flex flex-col gap-1.5">
              {[
                { href: "/achievements", label: "Achievements" },
                { href: "/alumni", label: "Alumni Directory" },
                { href: "/council", label: "DAAN Council" },
                { href: "/events", label: "Events" },
                { href: "/calendar", label: "Calendar" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-nunito text-sm text-cream/80 hover:text-yellow transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-fredoka font-600 text-base text-yellow mb-3">Legal</h4>
            <ul className="flex flex-col gap-1.5">
              <li>
                <Link
                  href="/privacy"
                  className="font-nunito text-sm text-cream/80 hover:text-yellow transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="font-nunito text-sm text-cream/80 hover:text-yellow transition-colors"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cream/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-nunito text-xs text-cream/60">
            &copy; {year} DAAN IITG. All rights reserved.
          </p>
          <p className="font-nunito text-xs text-cream/60">
            Built with care by the DAAN team.
          </p>
        </div>
      </div>
    </footer>
  );
}
