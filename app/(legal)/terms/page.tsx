import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service · FaxJet",
};

const LAST_UPDATED = "May 27, 2026";

export default function TermsPage() {
  return (
    <div className="max-w-none">
      <p className="text-sm uppercase tracking-wider text-[#6B7280]">
        Last updated: {LAST_UPDATED}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#0A0A0A]">
        Terms of Service
      </h1>

      <Section title="1. Acceptance">
        <p>
          By installing or using FaxJet, you agree to these Terms of Service
          and the FaxJet Privacy Policy. If you do not agree, do not use the
          app.
        </p>
      </Section>

      <Section title="2. The service">
        <p>
          FaxJet is a mobile fax application that transmits documents you
          provide to recipient fax numbers via a regulated fax gateway. We do
          not guarantee successful delivery to every recipient — receiving fax
          machines may be busy, off, or misconfigured. Failed transmissions
          incur no charge.
        </p>
      </Section>

      <Section title="3. Subscription">
        <p>
          FaxJet offers a 3-day free trial followed by an auto-renewing weekly
          ($9.99/week) or monthly ($19.99/month) subscription. A pay-per-fax
          option ($4.99 per transmission) is also available. Subscriptions are
          billed through your Apple ID and renew unless cancelled at least 24
          hours before the renewal date. Manage or cancel from iOS Settings ›
          Apple ID › Subscriptions.
        </p>
      </Section>

      <Section title="4. Acceptable use">
        <p>
          You agree not to use FaxJet to transmit content that is unlawful,
          fraudulent, harassing, infringing, or otherwise prohibited by
          applicable law. You are responsible for ensuring you have the right
          to send the documents you fax.
        </p>
      </Section>

      <Section title="5. Account suspension">
        <p>
          We may suspend or terminate access to FaxJet if we reasonably believe
          you have violated these terms or applicable law. We may also suspend
          service for non-payment or fraud risk.
        </p>
      </Section>

      <Section title="6. Disclaimer">
        <p>
          FaxJet is provided &ldquo;as is&rdquo; without warranties of any
          kind. To the maximum extent permitted by law, Pyxa Studio disclaims
          all warranties of merchantability, fitness for a particular purpose,
          and non-infringement.
        </p>
      </Section>

      <Section title="7. Limitation of liability">
        <p>
          Pyxa Studio&apos;s aggregate liability arising out of or related to
          your use of FaxJet will not exceed the amount you paid us in the
          twelve months preceding the claim.
        </p>
      </Section>

      <Section title="8. Governing law">
        <p>
          These terms are governed by the laws of the Republic of Turkey,
          without regard to conflict-of-laws principles. The courts of
          Istanbul, Turkey have exclusive jurisdiction over any disputes.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Pyxa Studio · Istanbul, Turkey ·{" "}
          <a
            href="mailto:support@pyxastudio.com"
            className="text-[#1B5E47] underline"
          >
            support@pyxastudio.com
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
