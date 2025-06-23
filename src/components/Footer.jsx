import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faGlobe,
  faBook,
  faUsers,
  faLightbulb,
  faQuoteLeft,
  faArrowUp,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-navy via-darkGray to-navy text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        {/* Single Organized Section */}
        <div className="py-6">
          <div className="container mx-auto px-4">
            {/* Main Content - Horizontal Layout */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">

              {/* Brand & Vision */}
              <div className="text-center lg:text-left lg:flex-1">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2 text-sm" />
                  <h3 className="text-lg font-bold text-saffron">भारत दर्शन</h3>
                </div>
                <p className="text-xs text-gray-300 mb-2">
                  भारत की समृद्ध विरासत, संस्कृति और शाश्वत ज्ञान की खोज करना
                </p>
                <p className="text-xs text-gray-400 italic">Made with love for Bharat</p>
              </div>

              {/* Mission, Values & Philanthropists - Compact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:flex-1">
                {/* Mission */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                    <FontAwesomeIcon icon={faLightbulb} className="text-saffron mr-1 text-xs" />
                    Mission
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBook} className="text-green mr-2 text-xs" />
                        <span className="text-xs text-gray-300 font-medium">Preserve Wisdom</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="text-green mr-2 text-xs" />
                        <span className="text-xs text-gray-300 font-medium">Build Community</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faGlobe} className="text-green mr-2 text-xs" />
                        <span className="text-xs text-gray-300 font-medium">Share Heritage</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Values */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Core Values</h4>
                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-saffron/10 to-transparent rounded-lg p-2 border border-saffron/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-saffron font-semibold">सत्य</span>
                        <span className="text-xs text-gray-400">Truth</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green/10 to-transparent rounded-lg p-2 border border-green/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green font-semibold">धर्म</span>
                        <span className="text-xs text-gray-400">Righteousness</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-400/10 to-transparent rounded-lg p-2 border border-orange-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-orange-400 font-semibold">शांति</span>
                        <span className="text-xs text-gray-400">Peace</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Humanity & Contribution */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-red-400 mr-1 text-xs" />
                    Philanthropists
                  </h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <p className="leading-relaxed">
                      Those who love humanity can help preserve our heritage for all.
                    </p>
                    <div className="bg-white/5 rounded px-2 py-1 border border-white/10 mt-2">
                      <span className="text-saffron font-medium italic">"वसुधैव कुटुम्बकम्"</span>
                      <p className="text-gray-400 text-xs mt-0.5">The world is one family</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll to Top */}
              <div className="lg:flex-shrink-0">
                <button
                  onClick={scrollToTop}
                  className="bg-saffron hover:bg-orange-600 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                  aria-label="Scroll to top"
                >
                  <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
                </button>
              </div>
            </div>

            {/* Bottom Copyright - Single Line */}
            <div className="border-t border-white/20 pt-3">
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 space-y-1 sm:space-y-0">
                <span>© {new Date().getFullYear()} भारत दर्शन. All rights reserved.</span>
                <span>Preserving wisdom, inspiring minds.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
