import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-12 sm:pt-52 sm:pb-20 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/gallery/resort-beach-view.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-bold mb-3 sm:mb-6">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm sm:text-xl max-w-3xl mx-auto leading-relaxed text-white/90">
            Please read these terms carefully before booking your stay at St James Court Beach Resort.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <p className="text-sm text-slate-500 mb-10">Last Updated: March 2026</p>
          </AnimatedSection>

          {/* Welcome */}
          <AnimatedSection>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Welcome
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Welcome to St James Court Beach Resort, located on the serene coast of Puducherry. By making a
                reservation or staying at our resort, you agree to abide by the following terms and conditions.
                These terms are designed to ensure a comfortable and enjoyable experience for all our guests.
                We encourage you to review them thoroughly before confirming your booking.
              </p>
            </div>
          </AnimatedSection>

          {/* Booking & Reservations */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Booking &amp; Reservations
              </h2>
              <div className="space-y-3 text-slate-600 leading-relaxed">
                <p>
                  All reservations are subject to availability and confirmation by the resort. A valid
                  government-issued photo identification is required at the time of booking and check-in.
                </p>
                <p>
                  An advance payment may be required to confirm your reservation. The resort reserves the right
                  to cancel unconfirmed bookings where the advance payment has not been received within the
                  stipulated timeframe.
                </p>
                <p>
                  Room rates are subject to change based on season, demand, and applicable promotions. The rate
                  confirmed at the time of booking will be honoured for that reservation.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Check-in / Check-out */}
          <AnimatedSection delay={0.15}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Check-in &amp; Check-out
              </h2>
              <div className="space-y-3 text-slate-600 leading-relaxed">
                <p>
                  Check-in and check-out time is <span className="font-semibold text-slate-800">12:00 Noon</span>.
                  Early check-in or late check-out may be accommodated subject to availability and may attract
                  additional charges.
                </p>
                <p>
                  A valid photo ID (Aadhaar, Passport, Driving License, or Voter ID) is mandatory for all guests
                  at the time of check-in. All guests, including accompanying visitors, must register at the
                  reception desk upon arrival.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Payment */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Payment
              </h2>
              <div className="space-y-3 text-slate-600 leading-relaxed">
                <p>
                  St James Court Beach Resort accepts major credit cards, debit cards, UPI, net banking, and
                  cash payments. GST and other applicable taxes will be charged as per prevailing government
                  regulations.
                </p>
                <p>
                  The resort reserves the right to pre-authorise credit or debit cards at the time of check-in
                  for incidental charges. Final settlement must be completed at the time of check-out.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Guest Conduct */}
          <AnimatedSection delay={0.25}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Guest Conduct
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Guests are expected to maintain decorum and behave in a manner that does not cause inconvenience
                or discomfort to other guests or staff. The resort reserves the right to refuse service or ask a
                guest to vacate the premises if their conduct is deemed inappropriate, disruptive, or in
                violation of resort policies. No refund will be provided in such cases.
              </p>
            </div>
          </AnimatedSection>

          {/* Property Damage */}
          <AnimatedSection delay={0.3}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Property Damage
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Guests will be held responsible for any damage caused to resort property, furnishings, fixtures,
                or equipment during their stay. The cost of repair or replacement will be charged to the
                guest&apos;s account and must be settled before check-out.
              </p>
            </div>
          </AnimatedSection>

          {/* Liability */}
          <AnimatedSection delay={0.35}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Liability
              </h2>
              <p className="text-slate-600 leading-relaxed">
                St James Court Beach Resort is not liable for the loss, theft, or damage of personal belongings
                of guests. A safety deposit facility is available at the reception desk for the safekeeping of
                valuables such as jewellery, documents, and electronic devices. Guests are advised to make use
                of this service during their stay.
              </p>
            </div>
          </AnimatedSection>

          {/* Swimming Pool */}
          <AnimatedSection delay={0.4}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Swimming Pool
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Use of the swimming pool is at the guest&apos;s own risk. Children under the age of 12 must be
                accompanied by an adult at all times while in or around the pool area. Guests are required to
                follow posted pool rules and timings. The resort is not responsible for any injuries or accidents
                that occur in the pool area.
              </p>
            </div>
          </AnimatedSection>

          {/* Pets */}
          <AnimatedSection delay={0.45}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Pets
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Pets are not permitted on the resort premises. An exception is made for certified service animals
                that are required to assist guests with disabilities. Guests with service animals are requested
                to inform the resort at the time of booking.
              </p>
            </div>
          </AnimatedSection>

          {/* Smoking */}
          <AnimatedSection delay={0.5}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Smoking Policy
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Smoking is strictly prohibited in all indoor areas including guest rooms, restaurants, corridors,
                and common spaces. Designated smoking areas are available in select outdoor locations around the
                resort. A cleaning surcharge will apply if evidence of smoking is found in non-designated areas.
              </p>
            </div>
          </AnimatedSection>

          {/* Right to Admission */}
          <AnimatedSection delay={0.55}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Right to Admission
              </h2>
              <p className="text-slate-600 leading-relaxed">
                St James Court Beach Resort reserves the right to refuse admission or deny entry to any
                individual at its sole discretion. This right may be exercised in the interest of safety,
                security, or the comfort of other guests and staff.
              </p>
            </div>
          </AnimatedSection>

          {/* Governing Law */}
          <AnimatedSection delay={0.6}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Governing Law
              </h2>
              <p className="text-slate-600 leading-relaxed">
                These terms and conditions are governed by the laws of India. Any disputes arising from or in
                connection with these terms shall be subject to the exclusive jurisdiction of the courts in
                Puducherry, India.
              </p>
            </div>
          </AnimatedSection>

          {/* Contact */}
          <AnimatedSection delay={0.65}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions regarding these terms and conditions, please feel free to reach out to us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <p className="text-slate-700">
                    <span className="font-semibold">Email:</span>{' '}
                    <a href="mailto:info@stjamescourtbeachresort.com" className="text-blue-600 hover:underline">
                      info@stjamescourtbeachresort.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Back Link */}
          <AnimatedSection delay={0.7}>
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                &larr; Back to Home
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
