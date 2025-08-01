import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, CreditCard } from 'lucide-react';

export default function PoliciesPage() {
  const policies = [
    {
      title: 'Terms and Conditions',
      description: 'Learn about the terms and conditions that govern your use of Zentha Notes.',
      icon: Shield,
      href: '/policies/terms-and-conditions',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100'
    },
    {
      title: 'Privacy Policy',
      description: 'Understand how we collect, use, and protect your personal information.',
      icon: Lock,
      href: '/policies/privacy-policy',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100'
    },
    {
      title: 'Refund and Cancellation Policy',
      description: 'Learn about our refund policies and subscription cancellation procedures.',
      icon: CreditCard,
      href: '/policies/refund-cancellation',
      color: 'from-orange-600 to-red-600',
      bgColor: 'from-orange-50 to-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Policies & Legal Information
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We believe in transparency and want you to understand how we operate. 
              Please review our policies to understand your rights and our responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {policies.map((policy, index) => {
              const IconComponent = policy.icon;
              return (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 group">
                  <CardHeader className="bg-gray-700 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-8 w-8 text-white" />
                      <CardTitle className="text-xl text-white">{policy.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {policy.description}
                    </p>
                    <Link href={policy.href}>
                      <Button 
                        className="w-full bg-gray-600 hover:bg-gray-500 transition-all duration-300"
                        size="lg"
                      >
                        Read Policy
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Why These Policies Matter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  For You
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Clear understanding of your rights
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Transparent refund and cancellation process
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Protection of your personal data
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Fair and reasonable terms of service
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  For Us
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Legal compliance and protection
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Clear service expectations
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Dispute resolution framework
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Trust and transparency with users
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gray-700 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Policies?</h3>
              <p className="text-gray-300 mb-6">
                Our support team is here to help clarify any questions you may have about our policies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-gray-300 text-gray-300 hover:bg-gray-600 hover:text-white">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-300 hover:bg-gray-600 hover:text-white">
                  Email Us
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              Last updated: January 2025 | 
              <Link href="/policies/terms-and-conditions" className="text-blue-400 hover:underline ml-1">
                Terms
              </Link>
              {' | '}
              <Link href="/policies/privacy-policy" className="text-blue-400 hover:underline">
                Privacy
              </Link>
              {' | '}
              <Link href="/policies/refund-cancellation" className="text-blue-400 hover:underline">
                Refunds
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 