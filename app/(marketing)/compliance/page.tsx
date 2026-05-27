import type { Metadata } from "next";

import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Compliance — CCH Automobile",
  description:
    "How CCH Automobile complies with export, import, anti-money-laundering, sanctions, and anti-corruption rules.",
};

export default function CompliancePage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Compliance"
      lastUpdated="May 16, 2026"
      intro="Cross-border vehicle export touches several regulatory regimes. This page summarises how CCH Automobile complies with them and what we ask of our buyers."
    >
      <section>
        <h2>1. Export from China</h2>
        <p>
          CCH Automobile holds the licences required to export new and used
          electric vehicles from Guangzhou. Every shipment leaves the
          Guangzhou customs zone with the export declaration, commercial
          invoice, packing list, bill of lading, and country-of-origin
          certificate that the destination country requires.
        </p>
      </section>

      <section>
        <h2>2. Import at destination</h2>
        <p>
          Buyers are the importer of record at the destination port and
          remain responsible for local duties, levies, and clearing fees.
          For the West African corridor this typically includes Nigerian
          customs duty, ECOWAS levy, NAC levy, terminal handling, and the
          clearing agent fee. CCH can recommend clearing partners in Lagos
          Apapa, Lagos Tin Can, Tema, Cotonou, and Dakar, but the engagement
          is between the buyer and the agent.
        </p>
      </section>

      <section>
        <h2>3. Sanctions and trade controls</h2>
        <p>
          We screen counterparties and destination details against the UN,
          EU, OFAC, UK, and applicable Chinese sanctions lists before
          accepting a deposit. We do not ship to sanctioned jurisdictions or
          to individuals or entities subject to asset-freeze measures, and
          we reserve the right to cancel an order at any point if a sanctions
          concern arises.
        </p>
      </section>

      <section>
        <h2>4. Anti-money-laundering and know-your-customer</h2>
        <p>
          Vehicle exports cross thresholds where AML rules apply. For each
          buyer, before the balance payment, we collect and verify:
        </p>
        <ul>
          <li>A government-issued photo ID for individuals.</li>
          <li>
            Certificate of incorporation, beneficial-ownership disclosure,
            and director ID for companies.
          </li>
          <li>
            Proof of source of funds where the payment is over USD 50,000
            or where the bank flags additional review.
          </li>
        </ul>
        <p>
          We hold KYC records for the period required by Chinese AML
          regulations.
        </p>
      </section>

      <section>
        <h2>5. Anti-bribery and anti-corruption</h2>
        <p>
          CCH does not pay facilitation payments, kickbacks, or any
          improper inducement to officials, customs agents, port workers, or
          partners. Our quoted fees are the only fees you owe CCH. If anyone
          claiming to act for CCH asks you for a payment outside the quoted
          fee schedule, please report it to hello@chinesecarshub.com.
        </p>
      </section>

      <section>
        <h2>6. Vehicle authenticity and history</h2>
        <p>
          New units are sourced directly from manufacturer-authorised
          channels in China. Used units are sourced from verified first
          owners. Every used unit is checked against the Chinese vehicle
          registration database before purchase, and CCH does not buy
          accident-write-offs, flood-damaged cars, or unrecorded resales.
        </p>
      </section>

      <section>
        <h2>7. Battery shipping</h2>
        <p>
          Lithium-ion battery packs are classified as dangerous goods under
          the International Maritime Dangerous Goods (IMDG) Code. CCH
          arranges shipment in compliance with IMDG Class 9 requirements,
          including state-of-charge limits, packing, and labelling.
        </p>
      </section>

      <section>
        <h2>8. Data protection</h2>
        <p>
          Personal data handling is described in our{" "}
          <a href="/privacy">Privacy policy</a>.
        </p>
      </section>

      <section>
        <h2>9. Reporting a concern</h2>
        <p>
          If you have a compliance question or want to report misconduct
          relating to CCH, write to hello@chinesecarshub.com with
          &quot;Compliance&quot; in the subject. Reports are acknowledged
          within five business days and reviewed by the operations lead.
        </p>
      </section>
    </LegalShell>
  );
}
