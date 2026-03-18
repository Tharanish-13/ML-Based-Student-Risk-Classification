import React from 'react';
import { Mail, Phone, MapPin, FileQuestion, MessageCircle } from 'lucide-react';

const Support = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-xl text-gray-600">How can we help you today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-indigo-600" />
            Contact Us
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <Mail className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-gray-600">tharanishj1318@gmail.com</p>
                <p className="text-sm text-gray-500 mt-1">We aim to respond within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-gray-600">+91 9489229976</p>
                <p className="text-sm text-gray-500 mt-1">Available Mon-Fri, 9am - 5pm.</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Office Location</p>
                <p className="text-gray-600">Sathyamangalam<br />Erode, Tamil Nadu - 638402</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FileQuestion className="w-6 h-6 mr-2 text-indigo-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group border-b border-gray-200 pb-4">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>How is the risk level calculated?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm">
                Risk level is calculated using a Machine Learning model that analyzes attendance, internal marks, number of assignments completed, and average study hours per week.
              </p>
            </details>
            <details className="group border-b border-gray-200 pb-4">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>I forgot my password, how do I reset it?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm">
                Contact your administrator to have your password reset, or use the "Forgot Password" link on the login page if available.
              </p>
            </details>
            <details className="group border-b border-gray-200 pb-4">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>How do I update my profile information?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm">
                Click on the "Profile" link in the navigation menu. From there, you can view and edit your personal information such as department and mobile number.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Send us a message</h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Briefly describe your issue" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Provide more details about your inquiry" required></textarea>
          </div>
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;
