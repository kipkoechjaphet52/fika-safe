import Header from '@/app/Components/Header'
import React from 'react'

export default function page() {
  const email = process.env.EMAIL_USER;
  return (
    <div className="bg-gray-100 text-gray-800 leading-relaxed">
        <Header/>
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
            <h1 className="text-3xl font-bold mb-4 text-blue-700">Terms and Conditions</h1>
            <p className="text-sm text-gray-500 mb-6">Effective Date: <strong>01/04/2025</strong></p>

            <p className="mb-4">
            Welcome to our platform. These Terms and Conditions (&quot;Terms&quot;) govern your use of our application and services (&quot;the Service&quot;). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">1. Acceptance of Terms</h2>
            <p className="mb-4">
            By accessing or using this platform, you agree to comply with these Terms, our Privacy Policy, and applicable laws. If using on behalf of an organization, you confirm you have authority to bind them.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">2. Eligibility</h2>
            <p className="mb-4">
            You must be at least 13 years old to use the Service. Under 18s must use the Service under supervision of a parent or guardian.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">3. User Accounts</h2>
            <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Keep your login credentials confidential.</li>
            <li>You&apos;re responsible for activities under your account.</li>
            <li>Notify us immediately of unauthorized use.</li>
            </ul>
            <p>We may suspend or terminate accounts that violate these Terms.</p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">4. Use of the Service</h2>
            <p className="mb-2">You agree to use the platform for lawful purposes only, including:</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Reporting real and accurate security incidents</li>
            <li>Accessing safety alerts and emergency services</li>
            </ul>
            <p className="mb-2">You must not:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 text-red-600">
            <li>Submit false/misleading reports</li>
            <li>Use the platform to harass or harm others</li>
            <li>Upload malicious content</li>
            </ul>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">5. Content Ownership</h2>
            <p className="mb-4">
            You retain ownership of your content. By submitting it, you grant us a license to use it within the platform and for public safety awareness, without compromising identity unless consent is given.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">6. Location and Emergency Data</h2>
            <p className="mb-4">
            You consent to the use of location data to coordinate emergencies, optimize routes, and alert others. You may disable this in settings, but some features may not work without it.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">7. Third-Party Services</h2>
            <p className="mb-4">
            We may use third-party tools (e.g., maps, analytics). We&apos;re not responsible for their privacy practices or actions.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">8. Termination</h2>
            <p className="mb-4">
            We reserve the right to terminate or suspend your account for any breach of these Terms or unlawful activity.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">9. Limitation of Liability</h2>
            <p className="mb-4">
            We are not liable for indirect or consequential damages, delays in emergency response, or data loss. Use of the platform is at your own risk.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">10. Modifications</h2>
            <p className="mb-4">
            We may update these Terms at any time. Changes will be posted here, and continued use implies acceptance of updates.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">11. Governing Law</h2>
            <p className="mb-4">
            These Terms are governed by the laws of <span className="italic">Kenya</span>.
            </p>

            <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">12. Contact Us</h2>
            <p className="mb-4">
            If you have any questions, reach out to us:
            </p>
            <ul className="list-none space-y-1">
            <li>📧 Email: <span className="text-blue-600">{email}</span></li>
            <li>🏢 Address: <span className="text-blue-600">P.O Box 190-50100, Kakamega, Kenya</span></li>
            </ul>
        </div>
    </div>
  )
}
