import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faSignInAlt, 
  faUserPlus,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { getCommentsByPostId } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import LoadingSpinner from './LoadingSpinner';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getCommentsByPostId(postId);
      setComments(fetchedComments);
    } catch (error) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    fetchComments(); // Refresh comments when a new one is added
  };

  const handleCommentDeleted = () => {
    fetchComments(); // Refresh comments when one is deleted/updated
  };

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner text="Loading comments..." />
      </div>
    );
  }

  return (
    <section className="mt-16 border-t border-gray-200 pt-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faComments} className="text-2xl text-saffron" />
          <h2 className="text-2xl font-bold text-darkGray">
            Comments ({comments.length})
          </h2>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Authentication Prompt for Non-logged-in Users */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-saffron/10 to-green/10 border border-saffron/20 rounded-lg p-6 mb-8">
          <div className="text-center">
            <FontAwesomeIcon icon={faComments} className="text-4xl text-saffron mb-4" />
            <h3 className="text-xl font-semibold text-darkGray mb-2">
              Join the Conversation
            </h3>
            <p className="text-gray-600 mb-6">
              Sign in or create an account to share your thoughts and engage with the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 bg-saffron text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 font-medium"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center space-x-2 bg-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 font-medium"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Comment Form for Logged-in Users */}
      {currentUser && (
        <div className="mb-8">
          <CommentForm 
            postId={postId} 
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}

      {/* Comments List */}
      <div>
        <CommentList 
          comments={comments}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>

      {/* Empty State for No Comments */}
      {comments.length === 0 && !loading && (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faComments} className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No comments yet
          </h3>
          <p className="text-gray-500">
            {currentUser 
              ? "Be the first to share your thoughts on this article!"
              : "Sign in to be the first to comment on this article!"
            }
          </p>
        </div>
      )}
    </section>
  );
};

export default CommentsSection;
