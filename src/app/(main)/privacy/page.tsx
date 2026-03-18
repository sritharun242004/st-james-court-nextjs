import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-xl max-w-3xl mx-auto leading-relaxed text-white/90">
            Your privacy matters to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <p className="text-sm text-slate-500 mb-10">Last Updated: March 2026</p>
          </AnimatedSection>

          {/* Introduction */}
          <AnimatedSection>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed">
                St James Court Beach Resort is committed to protecting the privacy and personal information of
                our guests. This Privacy Policy explains how we collect, use, store, and safeguard your data when
                you interact with our website, make a reservation, or stay at our resort. By using our services,
                you consent to the practices described in this policy.
              </p>
            </div>
          </AnimatedSection>

          {/* Information We Collect */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4 sm:mb-6">
                Information We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We may collect the following types of personal information when you make a reservation, check in,
                or use our services:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Full name',
                  'Email address',
                  'Phone number',
                  'Postal address',
                  'ID details (for check-in verification)',
                  'Payment information',
                  'Booking preferences',
                  'Special requests and dietary requirements',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* How We Use Information */}
          <AnimatedSection delay={0.15}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4 sm:mb-6">
                How We Use Your Information
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The personal information we collect is used for the following purposes:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: 'Process Reservations',
                    desc: 'To confirm, manage, and fulfil your room bookings and service requests.',
                  },
                  {
                    title: 'Communicate About Bookings',
                    desc: 'To send booking confirmations, reminders, and important updates related to your stay.',
                  },
                  {
                    title: 'Improve Our Services',
                    desc: 'To understand guest preferences and enhance the quality of our hospitality and amenities.',
                  },
                  {
                    title: 'Legal Compliance',
                    desc: 'To comply with legal obligations, regulatory requirements, and government directives.',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Data Security */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Data Security
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We implement appropriate technical and organisational security measures to protect your personal
                data against unauthorised access, alteration, disclosure, or destruction. Our systems use
                encryption and secure protocols to safeguard sensitive information such as payment details. While
                we strive to protect your personal data, no method of electronic transmission or storage is
                completely secure, and we cannot guarantee absolute security.
              </p>
            </div>
          </AnimatedSection>

          {/* Cookies */}
          <AnimatedSection delay={0.25}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Cookies
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience,
                analyse site traffic, and understand usage patterns. Cookies are small data files stored on your
                device that help us improve site functionality and personalise content. You may choose to disable
                cookies through your browser settings, though this may affect certain features of the website.
              </p>
            </div>
          </AnimatedSection>

          {/* Third-Party Sharing */}
          <AnimatedSection delay={0.3}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Third-Party Sharing
              </h2>
              <div className="space-y-3 text-slate-600 leading-relaxed">
                <p>
                  St James Court Beach Resort does not sell, trade, or rent your personal information to third
                  parties. We may share your data in the following limited circumstances:
                </p>
                <div className="space-y-2 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <span className="font-semibold text-slate-800">Payment Processors:</span> We share
                      necessary transaction details with trusted payment gateway providers to process your
                      payments securely.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <span className="font-semibold text-slate-800">Legal Authorities:</span> We may disclose
                      personal information when required by law, court order, or government regulation, or to
                      protect the rights, safety, or property of the resort and its guests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Guest ID Requirements */}
          <AnimatedSection delay={0.35}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4 sm:mb-6">
                Guest ID Requirements
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                A valid government-issued photo ID is required at the time of check-in for all guests. Accepted
                forms of identification include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {['Aadhaar Card', 'Passport', 'Driving License', 'Voter ID'].map((id, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-700 text-sm">{id}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed">
                Foreign nationals are required to present a valid passport along with a current visa at the time
                of check-in, as mandated by government regulations.
              </p>
            </div>
          </AnimatedSection>

          {/* Data Retention */}
          <AnimatedSection delay={0.4}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Data Retention
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We retain personal data for the duration required by applicable laws, regulatory requirements,
                and legitimate business purposes. Guest records, including booking history and identification
                details, are maintained in accordance with hospitality industry standards and government mandates.
                Once the retention period expires, personal data is securely deleted or anonymised.
              </p>
            </div>
          </AnimatedSection>

          {/* Your Rights */}
          <AnimatedSection delay={0.45}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Your Rights
              </h2>
              <div className="space-y-3 text-slate-600 leading-relaxed">
                <p>
                  You have the right to access, correct, or request deletion of your personal data held by us.
                  If you wish to exercise any of these rights, please contact us using the details provided below.
                </p>
                <p>
                  We will respond to your request within a reasonable timeframe and in accordance with applicable
                  data protection laws. Please note that certain data may need to be retained for legal or
                  regulatory compliance even after a deletion request.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact */}
          <AnimatedSection delay={0.5}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-3 sm:mb-4">
                Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                For any questions, concerns, or requests regarding this Privacy Policy or your personal data,
                please contact us:
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
          <AnimatedSection delay={0.55}>
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
