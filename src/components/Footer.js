import React from 'react';

const Footer = ({ className }) => (
  <footer className={`bg-gray-800 text-white py-4 ${className}`} style={{ border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '15px 15px 0 0', margin: '0 10px' }}>
    <div className="container mx-auto text-center px-4">
      <p className="text-sm">
        © {new Date().getFullYear()} Dairy-Farm-Management-System. All rights reserved.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Empowering dairy farmers with modern management solutions
      </p>
      
      {/* Navigation Links */}
      <div className="mt-4">
        <a href="/about" className="text-gray-400 hover:text-white mx-2">About Us</a>
        <a href="/contact" className="text-gray-400 hover:text-white mx-2">Contact Us</a>
        <a href="/privacy" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
        <a href="/terms" className="text-gray-400 hover:text-white mx-2">Terms of Service</a>
      </div>

      {/* Social Media Links */}
      <div className="mt-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white mx-2">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white mx-2">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white mx-2">Instagram</a>
      </div>

      {/* Contact Information */}
      <div className="mt-4">
        <p className="text-xs text-gray-400">Contact us: <a href="mailto:support@dairyfarm.com" className="text-gray-400 hover:text-white">support@dairyfarm.com</a></p>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-4">
        <input type="email" placeholder="Subscribe to our newsletter" className="p-2 rounded" />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Subscribe</button>
      </div>
    </div>
  </footer>
);

export default Footer;