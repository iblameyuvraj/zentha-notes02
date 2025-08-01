import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-400">
              Last updated: January 2025
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-700">
              <CardTitle className="text-2xl text-white">1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                subscribe to our services, or contact us for support.
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-200">Personal Information:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Name and email address</li>
                  <li>Educational institution and course details</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Usage data and preferences</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Develop new products and services</li>
                  <li>Protect against fraud and abuse</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">3. Information Sharing</CardTitle>
              </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With trusted service providers who assist in operating our platform</li>
              </ul>
            </CardContent>
          </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                  over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">5. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our platform:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Essential cookies for basic functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Marketing cookies for personalized content</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">7. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If you are a parent or guardian and 
                  believe your child has provided us with personal information, please contact us.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">8. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  Your continued use of our services after any changes constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              For any questions about this Privacy Policy, please contact us at privacy@zenthanotes.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 