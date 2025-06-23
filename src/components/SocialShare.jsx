import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const SocialShare = ({ url, title, description }) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      // Silently fail
    }
  };

  const openShareWindow = (platform) => {
    window.open(
      shareLinks[platform],
      'share-window',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 my-8">
      <h3 className="text-lg font-semibold text-darkGray mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => openShareWindow('facebook')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faFacebook} />
          <span>Facebook</span>
        </button>

        <button
          onClick={() => openShareWindow('twitter')}
          className="flex items-center space-x-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faTwitter} />
          <span>Twitter</span>
        </button>

        <button
          onClick={() => openShareWindow('whatsapp')}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => openShareWindow('linkedin')}
          className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faLinkedin} />
          <span>LinkedIn</span>
        </button>

        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faLink} />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
