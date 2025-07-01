import { useState } from "react";

const faqs = [
  {
    question: "How do I reset my quiz progress?",
    answer: "Currently, quiz progress is automatically reset when you log out or refresh the page.",
  },
  {
    question: "Can I use this app without logging in?",
    answer: "No, Google login is required to track your history and generate personalized quizzes.",
  },
  {
    question: "Where can I report a bug?",
    answer: "You can report bugs directly using the contact form below or email us at support@aiquizapp.com.",
  },
];

const ContactSupport = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleFAQ = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact & Support</h1>

      {/* Support Info */}
      <div className="mb-10 bg-gray-100 p-4 rounded-xl shadow-sm">
        <p className="text-lg">
          💬 Need help? Contact us anytime at <a href="mailto:support@aiquizapp.com" className="text-blue-600 underline">support@aiquizapp.com</a>
        </p>
        <p className="mt-2">Our support team usually replies within 24 hours.</p>
      </div>

      {/* Contact Form */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-2 border rounded-md" required />
          <input type="email" placeholder="Your Email" className="w-full p-2 border rounded-md" required />
          <textarea placeholder="Your Message" className="w-full p-2 border rounded-md h-32" required></textarea>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, idx) => (
          <div key={idx} className="mb-3">
            <button
              className="w-full text-left bg-gray-200 p-3 rounded-md font-medium hover:bg-gray-300 transition"
              onClick={() => toggleFAQ(idx)}
            >
              {faq.question}
            </button>
            {expanded === idx && (
              <div className="bg-white p-3 border border-t-0 border-gray-300 rounded-b-md text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactSupport;
