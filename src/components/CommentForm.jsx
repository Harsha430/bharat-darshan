import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { addComment } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, userData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter a comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const commentData = {
        postId: postId,
        content: content.trim(),
        authorId: currentUser.uid,
        authorName: userData?.name || 'Anonymous'
      };

      await addComment(commentData);
      setContent('');
      onCommentAdded(); // Refresh comments
    } catch (error) {
      setError('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Don't show form if user is not logged in
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-darkGray mb-4">Add a Comment</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all duration-300 resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-r from-saffron to-green rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-medium">
                {userData?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <span>Commenting as <strong>{userData?.name}</strong></span>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="flex items-center space-x-2 bg-saffron text-white px-6 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
