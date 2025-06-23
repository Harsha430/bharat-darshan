import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendar, 
  faTrash, 
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { deleteComment, updateComment } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CommentList = ({ comments, onCommentDeleted }) => {
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, userData } = useAuth();

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      onCommentDeleted();
    } catch (error) {
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await updateComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent('');
      onCommentDeleted(); // Refresh comments
    } catch (error) {
      alert('Failed to update comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const canModifyComment = (comment) => {
    // Only the original commenter can edit/delete their own comments
    return currentUser && currentUser.uid === comment.authorId;
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FontAwesomeIcon icon={faUser} className="text-4xl mb-4 opacity-50" />
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-saffron to-green rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {comment.authorName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-darkGray">{comment.authorName}</h4>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                    {formatDate(comment.timestamp)}
                  </span>
                  {comment.updatedAt && (
                    <span className="text-orange-600">(edited)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {canModifyComment(comment) && (
              <div className="flex items-center space-x-2">
                {editingComment === comment.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      disabled={loading}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors duration-300"
                      title="Save"
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                      title="Cancel"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-300"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="ml-13">
            {editingComment === comment.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all duration-300 resize-none"
                rows={3}
                disabled={loading}
              />
            ) : (
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
