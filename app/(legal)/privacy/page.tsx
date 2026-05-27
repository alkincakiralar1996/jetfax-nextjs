import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · FaxJet",
  description: "How FaxJet handles your documents and data.",
};

const LAST_UPDATED = "May 27, 2026";

export default function PrivacyPage() {
  return (
    <div className="prose prose-zinc max-w-none">
      <p className="text-sm uppercase tracking-wider text-[#6B7280]">
        Last updated: {LAST_UPDATED}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#0A0A0A]">
        Privacy Policy
      </h1>

      <p className="mt-6 text-base leading-relaxed text-[#3F3F46]">
        FaxJet is a mobile fax application published by Pyxa Studio
        (&ldquo;FaxJet,&rdquo; &ldquo;we,&rdquo; or &ldquo;us&rdquo;). This
        policy explains what data the FaxJet iOS app collects, how it is used,
        and the rights you have over it. By using FaxJet you agree to the terms
        described below.
      </p>

      <Section title="1. Documents you fax">
        <p>
          When you send a fax through FaxJet, the document image (and an
          optional cover page) is transmitted through our fax gateway to the
          recipient phone number you provide. The transmission is encrypted in
          transit. We do not store the contents of your faxed documents on our
          servers after delivery completes or fails. A delivery receipt
          containing the recipient number, page count, transmission duration,
          confirmation number, and outcome is retained on your device for your
          records and may also be retained on our servers for up to 30 days for
          delivery troubleshooting.
        </p>
      </Section>

      <Section title="2. Information FaxJet collects">
        <p>FaxJet collects the minimum data required to deliver the service:</p>
        <ul>
          <li>
            <strong>Fax metadata:</strong> recipient phone number, page count,
            timestamps, transmission duration, and outcome.
          </li>
          <li>
            <strong>Account state:</strong> subscription status, trial
            expiration, and plan, stored locally and on our billing provider.
          </li>
          <li>
            <strong>Diagnostic data:</strong> anonymized crash reports and
            performance metrics from your device. We do not collect data that
            identifies you personally.
          </li>
        </ul>
        <p>
          We do not collect contacts, location, microphone, calendar, or
          fitness data. We do not display third-party advertising.
        </p>
      </Section>

      <Section title="3. Camera and Photo Library access">
        <p>
          FaxJet requests camera access only when you choose Scan with Camera,
          and photo library access only when you choose Photo Library. These
          permissions are used solely to capture or pick the pages you intend
          to fax. We do not access your full photo library or background camera
          feed at any other time.
        </p>
      </Section>

      <Section title="4. How we use information">
        <ul>
          <li>To transmit your fax to the recipient phone number.</li>
          <li>To display delivery confirmation receipts.</li>
          <li>
            To manage your subscription, free trial, and access to FaxJet
            features.
          </li>
          <li>
            To troubleshoot delivery failures and improve the reliability of
            the fax gateway.
          </li>
          <li>
            To comply with legal obligations and respond to lawful requests.
          </li>
        </ul>
      </Section>

      <Section title="5. Sharing with third parties">
        <p>FaxJet relies on a small number of service providers:</p>
        <ul>
          <li>
            <strong>Fax gateway:</strong> Telnyx or equivalent regulated
            carrier to transmit the fax to the recipient.
          </li>
          <li>
            <strong>Billing:</strong> Apple App Store (for subscription
            purchases) and our subscription management provider.
          </li>
          <li>
            <strong>Crash and performance reporting:</strong> anonymized
            aggregate diagnostic provider.
          </li>
        </ul>
        <p>
          These providers process data on our behalf under contract and may not
          use it for any other purpose. We do not sell your data to anyone.
        </p>
      </Section>

      <Section title="6. Data retention">
        <p>
          Document content is not retained after the transmission outcome is
          finalized. Fax metadata (recipient number, page count, timestamps,
          confirmation number, outcome) is retained for up to 30 days on our
          servers for delivery troubleshooting and is then deleted. Receipts
          remain on your device until you delete the app or clear history.
        </p>
      </Section>

      <Section title="7. Your rights">
        <p>
          You may request access to, correction of, or deletion of the data
          FaxJet holds about you. To make a request, email{" "}
          <a
            href="mailto:privacy@pyxastudio.com"
            className="text-[#1B5E47] underline"
          >
            privacy@pyxastudio.com
          </a>
          . You may also revoke camera or photo library permissions at any time
          in iOS Settings.
        </p>
      </Section>

      <Section title="8. Children">
        <p>
          FaxJet is intended for users aged 13 and older. We do not knowingly
          collect data from children under 13.
        </p>
      </Section>

      <Section title="9. HIPAA">
        <p>
          FaxJet operates a HIPAA-compliant fax gateway suitable for the
          transmission of protected health information when used in accordance
          with applicable agreements and regulations. Healthcare entities that
          wish to use FaxJet as a HIPAA Business Associate should contact{" "}
          <a
            href="mailto:hipaa@pyxastudio.com"
            className="text-[#1B5E47] underline"
          >
            hipaa@pyxastudio.com
          </a>{" "}
          for a Business Associate Agreement (BAA).
        </p>
      </Section>

      <Section title="10. Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be
          announced in-app and on this page. Continued use of FaxJet after a
          change means you accept the updated policy.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Pyxa Studio · Istanbul, Turkey ·{" "}
          <a
            href="mailto:privacy@pyxastudio.com"
            className="text-[#1B5E47] underline"
          >
            privacy@pyxastudio.com
          </a>
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-[#0A0A0A]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-[#3F3F46]">
        {children}
      </div>
    </section>
  );
}
