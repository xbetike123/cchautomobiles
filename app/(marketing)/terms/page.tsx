import type { Metadata } from "next";

import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms of service — CCH Automobile",
  description:
    "The terms that govern use of chinesecarshub.com and any purchase from CCH Automobile.",
};

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of service"
      lastUpdated="May 16, 2026"
      intro="These terms govern your use of chinesecarshub.com and any purchase from CCH Automobile Co. Ltd. By submitting a request or placing an order, you agree to them."
    >
      <section>
        <h2>1. The service</h2>
        <p>
          CCH Automobile sources new and used electric vehicles from Chinese
          manufacturers and first owners, inspects them on its Guangzhou lot,
          and arranges export shipping to ports across Africa. Listings on
          chinesecarshub.com are illustrative of current stock and rotate
          weekly.
        </p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old and legally able to enter
          contracts in your jurisdiction. By using the site you confirm that
          any information you submit is accurate and that you are not on any
          export-control or sanctions list.
        </p>
      </section>

      <section>
        <h2>3. Quotes and pricing</h2>
        <ul>
          <li>
            Prices on chinesecarshub.com are USD, FOB Guangzhou, and exclude
            ocean freight, insurance, destination duties, terminal handling,
            and clearing.
          </li>
          <li>
            All prices and availability are indicative until a written quote
            is issued by the CCH operations team and confirmed by you.
          </li>
          <li>
            Quotes are valid for the period stated on the quote (typically 7
            calendar days). Currency exchange movements after that window may
            cause the quote to be re-issued.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Deposits, payments, and refunds</h2>
        <ul>
          <li>
            A deposit, typically 20 percent of the FOB price, reserves a
            specific unit and triggers our inspection and paperwork workflow.
          </li>
          <li>
            The balance is due before the unit leaves the Guangzhou port.
          </li>
          <li>
            Deposits are refundable in full if the unit fails our pre-export
            inspection or if CCH cannot fulfill the order for any reason
            within the timeline on the quote. Deposits are non-refundable if
            you withdraw after the unit has cleared inspection and been
            allocated to you.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Inspection and condition</h2>
        <p>
          Every unit is inspected on the CCH lot before shipping and you
          receive a walkaround video. New vehicles ship with the factory
          warranty intact. Used vehicles ship with a battery-health report
          and the available service history. CCH does not warrant the
          vehicle beyond what the manufacturer or first owner provides; for
          used units, what you see on the inspection video and in the
          condition report is what you receive.
        </p>
      </section>

      <section>
        <h2>6. Shipping, customs, and delivery</h2>
        <ul>
          <li>
            CCH arranges ocean shipping, marine insurance, and export
            paperwork. You are the importer of record at the destination
            port and remain responsible for local duties, levies, and
            clearing.
          </li>
          <li>
            Estimated transit times to West African ports are 30 to 45 days
            from Guangzhou. Force majeure events (port strikes, weather,
            sanctions) may extend that window.
          </li>
          <li>
            Title transfers to you on payment of the full balance. Risk of
            loss transfers per Incoterms FOB once the unit crosses the
            ship&#39;s rail at Guangzhou.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Acceptable use</h2>
        <p>
          You agree not to submit fraudulent requests, attempt to overwhelm
          the site with automated traffic, or use chinesecarshub.com to
          coordinate any activity that violates export, sanctions, or
          anti-money-laundering law.
        </p>
      </section>

      <section>
        <h2>8. Intellectual property</h2>
        <p>
          The site, its design, photography, and walkaround footage are the
          property of CCH Automobile Co. Ltd. Brand and model marks belong
          to their respective manufacturers and appear here for descriptive
          purposes only.
        </p>
      </section>

      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, CCH&#39;s aggregate
          liability for any claim arising out of a purchase is limited to
          the price paid for the unit in question. We are not liable for
          indirect, incidental, or consequential damages.
        </p>
      </section>

      <section>
        <h2>10. Governing law and disputes</h2>
        <p>
          These terms are governed by the laws of the People&#39;s Republic
          of China. The parties will first attempt to resolve disputes in
          good faith. Failing that, disputes are referred to the Guangzhou
          Arbitration Commission. Nothing here removes consumer-protection
          rights you may have under your local law.
        </p>
      </section>

      <section>
        <h2>11. Changes</h2>
        <p>
          We may update these terms. When we do, the &quot;Last updated&quot;
          date at the top is revised. Existing quotes and orders remain
          governed by the version of the terms in force at the time the
          deposit was received.
        </p>
      </section>
    </LegalShell>
  );
}
