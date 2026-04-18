import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-[#fffcf2] min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center mb-4">Get in Touch</h1>
        <p className="text-gray-500 text-center mb-12 font-medium">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-mango-50 text-mango-600 rounded-full flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">Email Us</h3>
              <p className="text-gray-500 font-medium">support@mangobite.com</p>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-mango-50 text-mango-600 rounded-full flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">Call Us</h3>
              <p className="text-gray-500 font-medium">+1 (555) 123-4567</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-mango-50 text-mango-600 rounded-full flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">Visit Us</h3>
              <p className="text-gray-500 font-medium">123 Food Street, Tech Park<br/>San Francisco, CA 94105</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-mango-500 hover:bg-mango-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-mango-500/30 transition-transform active:scale-[0.98] mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
