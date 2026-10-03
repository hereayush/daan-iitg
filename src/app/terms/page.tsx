import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — DAAN IITG",
  description: "Terms and Conditions for using the DAAN IITG platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b-2 border-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-coral border-2 border-navy rounded-lg flex items-center justify-center shadow-cartoon">
              <span className="font-fredoka font-700 text-white text-xs">D</span>
            </div>
            <span className="font-fredoka font-700 text-lg text-navy">DAAN IITG</span>
          </Link>
          <Link href="/" className="font-nunito text-sm text-coral hover:underline">← Back</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card-cartoon bg-white p-8 sm:p-10">
          <h1 className="font-fredoka font-700 text-navy text-3xl sm:text-4xl mb-2">Terms &amp; Conditions</h1>
          <p className="font-nunito text-sm text-navy/50 mb-8">Last updated: October 2026</p>

          <div className="font-nunito text-navy/80 leading-relaxed space-y-6">
            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">1. Acceptance of Terms</h2>
              <p>
                By creating an account and using the DAAN IITG platform, you agree to these Terms and Conditions. If you do not agree, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">2. Eligibility</h2>
              <p>
                DAAN IITG is intended for current and former Dakshana Scholars affiliated with IIT Guwahati, as well as those directly connected to the DAAN community. Registering with false identity information is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">3. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must not share contact information from the alumni directory outside the DAAN community.</li>
                <li>You must not use the platform for spam, harassment, or any unlawful purpose.</li>
                <li>You must not attempt to gain unauthorized access to other users' accounts or any administrative functionality.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">4. Alumni Directory Data</h2>
              <p>
                Contact information (phone numbers, email addresses) displayed in the alumni directory is intended solely for the purpose of connecting DAAN community members. Sharing, selling, or misusing this data in any form is strictly prohibited and may result in immediate account termination.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">5. Content and Posts</h2>
              <p>
                Content posted by administrators (achievements, events, council profiles) is the property of DAAN IITG. Users may not copy, distribute, or reproduce this content without permission.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">6. Admin and Sub-Admin Powers</h2>
              <p>
                Administrators and sub-administrators are trusted members of the DAAN community. They are responsible for the accuracy of content posted. Misuse of admin privileges is grounds for removal of those privileges.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">7. Account Termination</h2>
              <p>
                DAAN IITG administrators reserve the right to suspend or terminate accounts that violate these Terms, without prior notice.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">8. Limitation of Liability</h2>
              <p>
                DAAN IITG provides this platform on an "as-is" basis. We are not liable for any damages arising from the use or inability to use the platform, or from reliance on information posted on the platform.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">9. Changes to Terms</h2>
              <p>
                These Terms may be updated from time to time. Continued use of the platform after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">10. Governing Law</h2>
              <p>
                These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Guwahati, Assam.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
