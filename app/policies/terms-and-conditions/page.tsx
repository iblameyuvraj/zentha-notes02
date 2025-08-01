import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-400">
              Last updated: January 2025
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-700">
              <CardTitle className="text-2xl text-white">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Zentha Notes, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">2. Use License</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials (information or software) on Zentha Notes 
                  for personal, non-commercial transitory viewing only.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-gray-300">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on Zentha Notes</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">3. Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  The materials on Zentha Notes are provided on an 'as is' basis. Zentha Notes makes no warranties, 
                  expressed or implied, and hereby disclaims and negates all other warranties including without limitation, 
                  implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                  of intellectual property or other violation of rights.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">4. Limitations</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  In no event shall Zentha Notes or its suppliers be liable for any damages (including, without limitation, 
                  damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                  to use the materials on Zentha Notes, even if Zentha Notes or a Zentha Notes authorized representative 
                  has been notified orally or in writing of the possibility of such damage.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">5. Revisions and Errata</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  The materials appearing on Zentha Notes could include technical, typographical, or photographic errors. 
                  Zentha Notes does not warrant that any of the materials on its website are accurate, complete, or current. 
                  Zentha Notes may make changes to the materials contained on its website at any time without notice.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">6. Links</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  Zentha Notes has not reviewed all of the sites linked to its website and is not responsible for the contents 
                  of any such linked site. The inclusion of any link does not imply endorsement by Zentha Notes of the site. 
                  Use of any such linked website is at the user's own risk.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">7. Site Terms of Use Modifications</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  Zentha Notes may revise these terms of use for its website at any time without notice. By using this website 
                  you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-2xl text-white">8. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  Any claim relating to Zentha Notes shall be governed by the laws of India without regard to its conflict 
                  of law provisions.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              For any questions regarding these Terms and Conditions, please contact us at support@zenthanotes.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 