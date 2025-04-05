import Header from '@/app/Components/Header'
import React from 'react'

export default function page() {
  const email = process.env.EMAIL_USER;
  return (
    <main>
      <Header/>
      <div className="bg-gray-50 text-gray-800 font-sans px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-6">Effective Date: 01/04/2025</p>
          <p className="mb-6">This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform ("the Service"). Your privacy is important to us, and we are committed to protecting your personal data.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
          <p className="mb-4">We collect several types of information to provide and improve our services:</p>

          <h3 className="font-semibold mb-1">a. Personal Identification Information</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Profile Picture (optional)</li>
            <li>User Role (e.g., USER, POLICE, AMBULANCE, etc.)</li>
          </ul>

          <h3 className="font-semibold mb-1">b. Location Data</h3>
          <ul className="list-disc list-inside mb-2">
            <li>Real-time GPS coordinates (latitude and longitude)</li>
            <li>Location timestamps</li>
          </ul>
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-4">
            📍 <strong>Note:</strong> Location tracking is used for safety, route optimization, and emergency services.
          </div>

          <h3 className="font-semibold mb-1">c. Incident Reports</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Title, description, and type of the incident</li>
            <li>Location and severity</li>
            <li>Media files (images/videos)</li>
            <li>Date and time</li>
          </ul>

          <h3 className="font-semibold mb-1">d. Device & Usage Data</h3>
          <ul className="list-disc list-inside mb-4">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Access times and pages viewed</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-4">
            <li>To provide and maintain our services</li>
            <li>To record and analyze incident reports</li>
            <li>To verify reports via authorized personnel (e.g., police or ambulance staff)</li>
            <li>To notify users and emergency responders</li>
            <li>To show incident and safety statistics</li>
            <li>To improve route recommendations and area safety mapping</li>
            <li>To respond to help messages or emergency contact requests</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-2">3. Sharing Your Information</h2>
          <p className="mb-4">We do not sell your personal data. However, your information may be shared in the following scenarios:</p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>With Verified Emergency Responders:</strong> Such as Police, Ambulance, or Carrier staff to respond to incidents or emergencies effectively.</li>
            <li><strong>With System Administrators:</strong> For moderation, verification of reports, and system maintenance.</li>
            <li><strong>With Legal Authorities:</strong> When legally required to comply with applicable laws, such as in response to a subpoena, court order, or government request.</li>
            <li><strong>With Media Outlets:</strong> Anonymized and/or selected incident data (e.g., type, location, time, media) may be shared with trusted media partners for the purpose of raising public awareness, reporting on safety trends, or promoting transparency — but only when it does not compromise individual safety, identity, or legal proceedings.</li>
            <li><strong>With Third-Party Services:</strong> Strictly for analytics, security, and performance monitoring — in compliance with this privacy policy and applicable laws.</li>
          </ul>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            ⚠️ <strong>We will never share personally identifiable information</strong> (such as your name, contact details, or precise GPS location) with media houses unless explicit consent is given or it is required by law.
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-2">4. Data Storage and Security</h2>
          <p className="mb-4">We store your information securely in a PostgreSQL database. We use best practices to protect your data, including:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Secure password hashing</li>
            <li>Role-based access control</li>
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Regular audits and updates</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-2">5. User Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Access your personal data</li>
            <li>Correct or update inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent for location tracking or reporting</li>
          </ul>
          <p className="mb-4">To exercise your rights, contact us at <strong>[{email}]</strong>.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">6. Children&apos;s Privacy</h2>
          <p className="mb-4">Our services are not intended for individuals under the age of 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">7. Changes to This Policy</h2>
          <p className="mb-4">We may update this Privacy Policy from time to time. When we do, we will notify users via in-app notification or email.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">8. Contact Us</h2>
          <p className="mb-2">If you have any questions about this Privacy Policy, contact us at:</p>
          <ul className="list-disc list-inside">
            <li>📧 Email: <strong>[{email}]</strong></li>
            <li>🏢 Address: <strong>[P.O Box 190-50100, Kakamega, Kenya]</strong></li>
          </ul>
        </div>
      </div>
    </main>
  )
}
