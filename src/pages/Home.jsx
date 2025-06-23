import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllPosts } from '../firebase/firestore';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [heroRef, heroVisible] = useScrollAnimation();

  useEffect(() => {
    fetchPosts();
    preloadBackgroundImage();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedTag]);

  const preloadBackgroundImage = () => {
    const img = new Image();
    img.onload = () => {
      setBackgroundImageLoaded(true);
    };
    img.onerror = () => {
      setBackgroundImageLoaded(false);
    };
    img.src = '/background.png';
  };

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(post => {
        // Search in title
        const titleMatch = post.title?.toLowerCase().includes(searchLower);

        // Search in content
        const contentMatch = post.content?.toLowerCase().includes(searchLower);

        // Search in author name
        const authorMatch = post.authorName?.toLowerCase().includes(searchLower);

        // Search in tags
        const tagMatch = post.tags?.some(tag =>
          tag.toLowerCase().includes(searchLower)
        );

        // Search in excerpt/description if available
        const excerptMatch = post.excerpt?.toLowerCase().includes(searchLower);

        // Return true if any field matches
        return titleMatch || contentMatch || authorMatch || tagMatch || excerptMatch;
      });
    }

    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags && post.tags.includes(selectedTag)
      );
    }

    setFilteredPosts(filtered);
  };

  const getAllTags = () => {
    const tags = new Set();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  if (loading) {
    return <LoadingSpinner text="Loading articles..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative py-20 fade-in-up visible`}
        style={{
          minHeight: '80vh',
          backgroundColor: '#f0f9ff',
          backgroundImage: backgroundImageLoaded ? 'url(/background.png)' : 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
        }}
      >
        <div className="relative container mx-auto px-4 z-10">
          {/* Centered Title and Subtitle */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6 drop-shadow-2xl" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              भारत दर्शन
            </h1>
            <p className="text-xl md:text-2xl text-darkGray drop-shadow-xl max-w-3xl mx-auto font-semibold" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
              Exploring the rich heritage, culture, and timeless wisdom of Bharat
            </p>
          </div>

          {/* Left-aligned Quote Container */}
          <div className="max-w-sm md:max-w-2xl">
            <div className="quote-box bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl p-4 md:p-6 rounded-lg">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-saffron text-xl md:text-2xl mb-3 md:mb-4" />
              <p className="text-sm md:text-lg italic text-darkGray font-medium leading-relaxed" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
                They may kill me, but they cannot kill my ideas. They may crush my body, but they will not be able to crush my spirit.
              </p>
              <p className="text-right text-navy font-semibold mt-3 md:mt-4 text-sm md:text-base" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>— Bhagat Singh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by title, content, author, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedTag === ''
                    ? 'bg-saffron text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {getAllTags().slice(0, 5).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedTag === tag
                      ? 'bg-saffron text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Info */}
          {(searchTerm || selectedTag) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span>
                  Showing {filteredPosts.length} of {posts.length} articles
                </span>
                {searchTerm && (
                  <span className="bg-saffron/10 text-saffron px-2 py-1 rounded">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedTag && (
                  <span className="bg-green/10 text-green px-2 py-1 rounded">
                    Tag: {selectedTag}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className="text-gray-500 hover:text-gray-700 underline ml-auto"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              {posts.length === 0 ? (
                <div>
                  <p className="text-xl text-gray-600 mb-4">No articles published yet. Check back soon!</p>
                  <p className="text-gray-500">We're working on bringing you amazing content about Indian culture and heritage.</p>
                </div>
              ) : (
                <div>
                  <p className="text-xl text-gray-600 mb-4">No articles found matching your search criteria.</p>
                  <div className="text-gray-500 space-y-2">
                    <p>Try:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Using different keywords</li>
                      <li>Searching for author names</li>
                      <li>Looking for specific tags</li>
                      <li>Checking your spelling</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag('');
                    }}
                    className="mt-4 bg-saffron text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
                  >
                    Show All Articles
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-darkGray mb-4">Latest Articles</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover stories about Indian culture, heritage, and the preservation of our mother tongue
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
