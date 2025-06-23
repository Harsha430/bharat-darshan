import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faCalendar, 
  faClock,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPostsByAuthor, deletePost } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchUserPosts();
    }
  }, [currentUser]);

  const fetchUserPosts = async () => {
    try {
      const userPosts = await getPostsByAuthor(currentUser.uid);
      setPosts(userPosts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(postId);
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      alert('Error deleting post. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExcerpt = (content, maxLength = 100) => {
    if (!content) return '';
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return <LoadingSpinner text="Loading your posts..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-darkGray mb-2">
                Welcome back, {userData?.name}!
              </h1>
              <p className="text-gray-600">
                Manage your articles and create new content for Bharat Darshan
              </p>
            </div>
            <Link
              to="/admin/new"
              className="mt-4 md:mt-0 bg-gradient-to-r from-saffron to-green text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>New Article</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Articles</p>
                <p className="text-3xl font-bold text-darkGray">{posts.length}</p>
              </div>
              <div className="w-12 h-12 bg-saffron/10 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faEdit} className="text-saffron text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Published This Month</p>
                <p className="text-3xl font-bold text-darkGray">
                  {posts.filter(post => {
                    const postDate = post.timestamp?.toDate ? post.timestamp.toDate() : new Date(post.timestamp);
                    const currentMonth = new Date().getMonth();
                    return postDate.getMonth() === currentMonth;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendar} className="text-green text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tags Used</p>
                <p className="text-3xl font-bold text-darkGray">
                  {new Set(posts.flatMap(post => post.tags || [])).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faTag} className="text-navy text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-darkGray">Your Articles</h2>
          </div>

          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faEdit} className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-darkGray mb-2">No articles yet</h3>
              <p className="text-gray-600 mb-6">
                Start sharing your thoughts and knowledge with the world
              </p>
              <Link
                to="/admin/new"
                className="btn-primary"
              >
                Create Your First Article
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map(post => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-saffron/10 text-saffron text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-darkGray mb-2 hover:text-saffron transition-colors duration-300">
                        <Link to={`/post/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {getExcerpt(post.content)}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                          {formatDate(post.timestamp)}
                        </span>
                        {post.updatedAt && (
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                            Updated {formatDate(post.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                      <Link
                        to={`/post/${post.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                        title="View Post"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                      
                      <Link
                        to={`/admin/edit/${post.id}`}
                        className="p-2 text-green hover:bg-green/10 rounded-lg transition-colors duration-300"
                        title="Edit Post"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deleteLoading === post.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300 disabled:opacity-50"
                        title="Delete Post"
                      >
                        {deleteLoading === post.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FontAwesomeIcon icon={faTrash} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
