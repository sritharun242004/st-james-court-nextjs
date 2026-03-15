import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';

export default function CancellationPolicy() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-52 pb-20 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/gallery/resort-beach-view.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            Cancellation Policy
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-white/90">
            Please review our cancellation, check-in, and refund policies before making your reservation.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <p className="text-sm text-slate-500 mb-10">Last Updated: March 2026</p>
          </AnimatedSection>

          {/* Check-in / Check-out */}
          <AnimatedSection>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-6">
                Check-in &amp; Check-out
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Check-in Time</h3>
                  <p className="text-2xl font-bold text-blue-600">12:00 Noon</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Check-out Time</h3>
                  <p className="text-2xl font-bold text-blue-600">12:00 Noon</p>
                </div>
              </div>
              <p className="text-slate-600 mt-6 leading-relaxed">
                Early check-in and late check-out are subject to availability and may incur additional charges.
                Please contact the front desk in advance if you require flexibility with your arrival or departure time.
              </p>
            </div>
          </AnimatedSection>

          {/* Cancellation Rules */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-6">
                Cancellation Rules
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Within 72 hours of check-in date</h3>
                    <p className="text-slate-600 mt-1">
                      No refund will be provided for cancellations made within 72 hours of the scheduled check-in date.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900">7 days or more before check-in</h3>
                    <p className="text-slate-600 mt-1">
                      A 50% refund of the total booking amount will be processed for cancellations made 7 days or more before the scheduled check-in date.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Refund Processing</h3>
                    <p className="text-slate-600 mt-1">
                      All eligible refunds will be processed within 21 working days from the date of cancellation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* No-Show Policy */}
          <AnimatedSection delay={0.15}>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-4">
                No-Show Policy
              </h2>
              <p className="text-slate-600 leading-relaxed">
                If the guest fails to arrive on the scheduled check-in date without prior notice, the full booking
                amount will be forfeited. We strongly recommend informing us of any changes to your travel plans
                as early as possible to avoid forfeiture.
              </p>
            </div>
          </AnimatedSection>

          {/* Modifications */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-4">
                Booking Modifications
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Booking date changes are subject to availability. Please contact the resort at least 48 hours
                before your scheduled check-in date to request any modifications. Changes to room type or
                number of guests may result in revised pricing.
              </p>
            </div>
          </AnimatedSection>

          {/* Group Bookings */}
          <AnimatedSection delay={0.25}>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-4">
                Group Bookings
              </h2>
              <p className="text-slate-600 leading-relaxed">
                For group bookings of 5 rooms or more, separate cancellation terms apply. Group reservations
                are subject to customised policies based on the size and nature of the booking. Please contact
                our reservations desk directly for detailed terms and conditions regarding group cancellations
                and modifications.
              </p>
            </div>
          </AnimatedSection>

          {/* Contact */}
          <AnimatedSection delay={0.3}>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-4">
                Contact for Cancellations
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                To cancel or modify your reservation, please reach out to us through one of the following channels:
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
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <p className="text-slate-700">
                    <span className="font-semibold">Phone:</span>{' '}
                    <a href="tel:04132655174" className="text-blue-600 hover:underline">
                      0413 2655 174
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Back Link */}
          <AnimatedSection delay={0.35}>
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
