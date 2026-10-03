import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — DAAN IITG",
  description: "Privacy Policy for DAAN IITG — Dakshana Alumni Network at IIT Guwahati.",
};

export default function PrivacyPage() {
  const lastUpdated = "October 2026";
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
          <h1 className="font-fredoka font-700 text-navy text-3xl sm:text-4xl mb-2">Privacy Policy</h1>
          <p className="font-nunito text-sm text-navy/50 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-sm max-w-none font-nunito text-navy/80 leading-relaxed space-y-6">
            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">1. Introduction</h2>
              <p>
                DAAN IITG ("we", "our", or "us") operates the DAAN IITG website and web application. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">2. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li><strong>Account information:</strong> Your name and email address when you register.</li>
                <li><strong>Profile data:</strong> Optional fields such as your Dakshana Roll Number (DRN) and batch.</li>
                <li><strong>Alumni data:</strong> Uploaded by administrators from official Dakshana records, including DRN, name, COE, parent school, batch, phone number, and email.</li>
                <li><strong>Usage data:</strong> Basic analytics on how you use the platform (page views, features used).</li>
                <li><strong>Push notification subscriptions:</strong> If you opt in, we store your push subscription endpoint to deliver notifications.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>To provide and maintain the DAAN IITG platform.</li>
                <li>To verify your identity and manage your account.</li>
                <li>To display your profile in the alumni directory (visible only to logged-in members).</li>
                <li>To send push notifications about new content (only if you have opted in).</li>
                <li>To improve the platform based on usage patterns.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">4. Who Can See Your Data</h2>
              <p>
                The alumni directory (including phone numbers and emails) is visible <strong>only to registered and logged-in members</strong> of DAAN IITG. It is not publicly accessible on the internet. Administrators have access to all user data for platform management purposes.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">5. Data Storage and Security</h2>
              <p>
                Your data is stored securely on Supabase (PostgreSQL), hosted in a secure cloud environment. We use Row Level Security (RLS) to ensure that users can only access data they are permitted to see. Authentication is handled via Supabase Auth with industry-standard encryption.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">6. Cookies</h2>
              <p>
                We use essential cookies to keep you logged in. We do not use advertising or third-party tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">7. Your Rights</h2>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>You may request deletion of your account and associated data by contacting an administrator.</li>
                <li>You may opt out of push notifications at any time through your browser settings.</li>
                <li>Alumni data uploaded from official records may be retained for the purposes of the alumni network.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify registered users of significant changes through the platform.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka font-600 text-navy text-xl mb-2">9. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, please contact the DAAN IITG administration team through the platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
