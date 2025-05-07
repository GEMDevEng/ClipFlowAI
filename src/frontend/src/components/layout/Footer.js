import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';

/**
 * Footer component
 * @returns {JSX.Element} - Footer component
 */
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to={ROUTES.HOME} className="text-xl font-bold text-purple-600">
              ClipFlowAI
            </Link>
            <p className="text-gray-600 mt-2">
              Automated AI system to generate & publish short-form videos
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="text-gray-800 font-semibold mb-2">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs" className="text-gray-600 hover:text-purple-600">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-purple-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/GEMDevEng/ClipFlowAI" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-semibold mb-2">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-purple-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-purple-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} ClipFlowAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
