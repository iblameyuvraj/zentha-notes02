import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RefundCancellationPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Refund and Cancellation Policy
            </h1>
            <p className="text-lg text-gray-400">
              Last updated: January 2025
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-700">
              <CardTitle className="text-2xl text-white">1. Subscription Cancellation</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                You may cancel your subscription at any time through your account settings or by contacting our support team.
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-200">Cancellation Process:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Log into your account and navigate to subscription settings</li>
                  <li>Click on "Cancel Subscription"</li>
                  <li>Confirm your cancellation</li>
                  <li>You will receive a confirmation email</li>
                </ul>
              </div>
              <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Note:</strong> Cancellation will take effect at the end of your current billing period.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">2. Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">7-Day Money-Back Guarantee:</h4>
                    <p className="text-gray-300 leading-relaxed">
                      We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied with our service 
                      within the first 7 days of your subscription, you can request a full refund.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">Partial Refunds:</h4>
                    <p className="text-gray-300 leading-relaxed">
                      For subscriptions cancelled after the 7-day period, we may offer partial refunds based on unused 
                      service time, subject to review and approval.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-green-900/20 rounded-lg">
                      <h5 className="font-semibold text-green-200 mb-2">Eligible for Refund:</h5>
                      <ul className="text-sm text-green-300 space-y-1">
                        <li>• Technical issues preventing service use</li>
                        <li>• Billing errors</li>
                        <li>• Service not as described</li>
                        <li>• Duplicate charges</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-red-900/20 rounded-lg">
                      <h5 className="font-semibold text-red-200 mb-2">Not Eligible for Refund:</h5>
                      <ul className="text-sm text-red-300 space-y-1">
                        <li>• Change of mind after 7 days</li>
                        <li>• Failure to cancel on time</li>
                        <li>• Violation of terms of service</li>
                        <li>• Excessive usage or abuse</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">3. Refund Process</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">How to Request a Refund:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      <li>Contact our support team via email or live chat</li>
                      <li>Provide your account details and reason for refund</li>
                      <li>Our team will review your request within 24-48 hours</li>
                      <li>If approved, refund will be processed within 5-10 business days</li>
                    </ol>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-900/20 rounded-lg">
                    <p className="text-blue-200 text-sm">
                      <strong>Processing Time:</strong> Refunds are typically processed within 5-10 business days, 
                      depending on your payment method and financial institution.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">4. Subscription Pauses</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  We understand that circumstances may require you to temporarily pause your subscription. 
                  You can pause your subscription for up to 3 months.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-200">Pause Features:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Freeze your billing cycle</li>
                    <li>Maintain access to downloaded content</li>
                    <li>Easy reactivation when ready</li>
                    <li>No additional fees for pausing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">5. Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Upon cancellation or account termination:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Your access to premium features will end at the billing period's conclusion</li>
                  <li>Downloaded content may remain accessible based on your device</li>
                  <li>Your account data will be retained for 30 days for potential reactivation</li>
                  <li>After 30 days, account data may be permanently deleted</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">6. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">For Refund Requests:</h4>
                    <p className="text-gray-300">Email: refunds@zenthanotes.com</p>
                    <p className="text-gray-300">Response Time: 24-48 hours</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 mb-2">For General Support:</h4>
                    <p className="text-gray-300">Email: support@zenthanotes.com</p>
                    <p className="text-gray-300">Live Chat: Available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Need Help?
              </h3>
              <p className="text-gray-300 mb-4">
                Our support team is here to help with any questions about refunds or cancellations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Badge variant="outline" className="text-sm">
                  Email: support@zenthanotes.com
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Response: Within 24 hours
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 