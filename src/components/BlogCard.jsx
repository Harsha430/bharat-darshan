import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faClock, faTag } from '@fortawesome/free-solid-svg-icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const BlogCard = ({ post }) => {
  const [ref, isVisible] = useScrollAnimation();

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return '';
    // Remove HTML tags and decode HTML entities
    const text = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace encoded ampersands
      .replace(/&lt;/g, '<') // Replace encoded less than
      .replace(/&gt;/g, '>') // Replace encoded greater than
      .replace(/&quot;/g, '"') // Replace encoded quotes
      .trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const calculateReadTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 fade-in-up ${
        isVisible ? 'visible' : ''
      }`}
    >
      {/* Image */}
      {post.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200/FF9933/FFFFFF?text=Bharat+Darshan';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-saffron/10 text-saffron text-xs font-medium rounded-full"
              >
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-darkGray mb-3 line-clamp-2 hover:text-saffron transition-colors duration-300">
          <Link to={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {getExcerpt(post.content)}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-1 text-saffron" />
              {post.authorName}
            </span>
            <span className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-1 text-green" />
              {calculateReadTime(post.content)} min read
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center mt-2 sm:mt-0 space-y-1 sm:space-y-0 sm:space-x-2">
            <span className="flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="mr-1 text-navy" />
              {formatDate(post.timestamp)}
            </span>
            {post.updatedAt && (
              <span className="text-orange-600 text-xs font-medium bg-orange-50 px-2 py-1 rounded-full">
                Updated
              </span>
            )}
          </div>
        </div>

        {/* Read More Button */}
        <div className="mt-4">
          <Link
            to={`/post/${post.id}`}
            className="inline-flex items-center text-saffron font-medium hover:text-orange-600 transition-colors duration-300"
          >
            Read More
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
