import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faClock, faTag, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ReadingProgress from '../components/ReadingProgress';
import SocialShare from '../components/SocialShare';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentsSection from '../components/CommentsSection';
import { getPostById, getAllPosts } from '../firebase/firestore';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const fetchedPost = await getPostById(id);
      setPost(fetchedPost);
      
      // Fetch related posts
      const allPosts = await getAllPosts();
      const related = allPosts
        .filter(p => p.id !== id)
        .filter(p => {
          if (!fetchedPost.tags || !p.tags) return false;
          return fetchedPost.tags.some(tag => p.tags.includes(tag));
        })
        .slice(0, 3);
      
      setRelatedPosts(related);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const formatContent = (content) => {
    // Check if content contains HTML tags (rich text)
    if (content.includes('<') && content.includes('>')) {
      return <div className="rich-content" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Fallback for plain text content
    return content
      .split('\n\n')
      .map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      ));
  };

  if (loading) {
    return <LoadingSpinner text="Loading article..." />;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-darkGray mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      
      {/* Hero Image */}
      {post.imageUrl && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400/FF9933/FFFFFF?text=Bharat+Darshan';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Back Button */}
          <Link
            to="/"
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-darkGray px-4 py-2 rounded-lg hover:bg-white transition-all duration-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back</span>
          </Link>
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-saffron/10 text-saffron text-sm font-medium rounded-full"
                >
                  <FontAwesomeIcon icon={faTag} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-darkGray mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-saffron" />
              <span className="font-medium">{post.authorName}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-green" />
              <span>{formatDate(post.timestamp)}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-navy" />
              <span>{calculateReadTime(post.content)} min read</span>
            </div>
            {post.updatedAt && (
              <div className="flex items-center">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Updated {formatDate(post.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-800 text-lg leading-relaxed">
            {formatContent(post.content)}
          </div>
        </div>

        {/* Social Share */}
        <SocialShare
          url={currentUrl}
          title={post.title}
          description={post.content.substring(0, 150) + '...'}
        />

        {/* Comments Section */}
        <CommentsSection postId={id} />

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default PostDetail;
