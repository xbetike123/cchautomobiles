import type { Metadata } from "next";

import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy policy — CCH Automobile",
  description:
    "How CCH Automobile collects, uses, and protects information from buyers requesting Chinese EV exports.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy policy"
      lastUpdated="May 16, 2026"
      intro="This policy explains what information CCH Automobile Co. Ltd collects when you use chinesecarshub.com, why we collect it, and how it is protected."
    >
      <section>
        <h2>1. Who we are</h2>
        <p>
          CCH Automobile Co. Ltd is a Guangzhou-based export operator. We
          source new and used electric vehicles from Chinese manufacturers and
          first owners, inspect them on our lot in Panyu District, and ship
          them to buyers across Africa. Our registered address is 101-103
          Agile Time Mansion, Wehai Road, Shibi, Panyu District, Guangzhou,
          China. You can reach us at hello@chinesecarshub.com.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <h3>Information you give us</h3>
        <ul>
          <li>
            Contact details you provide on the request form: name, WhatsApp
            number, email, destination city and country.
          </li>
          <li>
            Buying preferences: budget range, timeline, body type, new or
            used preference, and any notes you choose to share.
          </li>
          <li>
            Files or photos you send us through the form or by WhatsApp to
            illustrate the car you want.
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>
            Standard server logs (IP address, user agent, request paths) kept
            for security and abuse prevention.
          </li>
          <li>
            Privacy-respecting analytics from Vercel Analytics. We do not run
            third-party trackers, advertising pixels, or cross-site
            fingerprinting.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <ul>
          <li>To prepare a vehicle shortlist that matches your request.</li>
          <li>
            To contact you on WhatsApp or by email with quotes, inspection
            footage, and shipping updates.
          </li>
          <li>
            To process deposits, balance payments, and shipping paperwork
            once you decide to proceed.
          </li>
          <li>
            To detect abuse, prevent spam submissions, and meet our legal
            obligations.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Sharing your information</h2>
        <p>
          We do not sell lead information. We share data with third parties
          only when needed to operate the service: shipping lines, freight
          forwarders, customs brokers at your destination port, payment
          providers, and our hosting and notification vendors (Supabase,
          Vercel, Resend, Cloudflare, MailerLite, WhatsApp Cloud API). Each
          vendor receives only the information needed to perform its part of
          the job.
        </p>
      </section>

      <section>
        <h2>5. International transfers</h2>
        <p>
          Your information may be stored or processed in China, the European
          Union, or the United States depending on the vendor. We rely on
          standard contractual clauses or equivalent safeguards where
          required by your local law.
        </p>
      </section>

      <section>
        <h2>6. Retention</h2>
        <p>
          Lead records are kept for as long as your request is active and for
          up to three years after our last interaction so we can answer
          follow-up questions and meet tax, customs, and warranty
          recordkeeping requirements. You may ask us to delete your data
          earlier; see the next section.
        </p>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access,
          correct, export, or delete the personal information we hold about
          you, and to object to or restrict certain processing. To exercise
          any of these rights, email hello@chinesecarshub.com from the
          address on file. We respond within 30 days.
        </p>
      </section>

      <section>
        <h2>8. Security</h2>
        <p>
          Lead data is stored in Supabase with row-level security and
          access-controlled service-role keys. Service tokens and API keys
          are never exposed to the browser. Communications with
          chinesecarshub.com are encrypted in transit (TLS).
        </p>
      </section>

      <section>
        <h2>9. Changes to this policy</h2>
        <p>
          When we update this policy, we will revise the &quot;Last
          updated&quot; date above and, for material changes, post a notice
          on the home page for at least 14 days.
        </p>
      </section>
    </LegalShell>
  );
}
