import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faArrowLeft, 
  faImage, 
  faTag, 
  faTimes,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { getPostById, updatePost } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import LoadingSpinner from '../components/LoadingSpinner';

const EditPost = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const post = await getPostById(id);
      
      // Check if current user is the author
      if (post.authorId !== currentUser.uid) {
        setError('You can only edit your own posts.');
        return;
      }

      setFormData({
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || '',
        tags: post.tags || []
      });
      setFetchLoading(false);
    } catch (error) {
      setError('Failed to load post.');
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      setLoading(false);
      return;
    }

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: formData.imageUrl.trim(),
        tags: formData.tags
      };

      await updatePost(id, postData);
      navigate(`/post/${id}`);
    } catch (error) {
      setError('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content) => {
    // For rich text content, we'll render it as HTML
    return <div className="rich-content" dangerouslySetInnerHTML={{ __html: content }} />;
  };

  if (fetchLoading) {
    return <LoadingSpinner text="Loading post..." />;
  }

  if (error && fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/admin')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 text-gray-600 hover:text-saffron transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-darkGray">Edit Article</h1>
                <p className="text-gray-600">Update your published content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreview(!preview)}
                className="px-4 py-2 text-navy border border-navy rounded-lg hover:bg-navy hover:text-white transition-all duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faEye} />
                <span>{preview ? 'Edit' : 'Preview'}</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {preview ? (
          /* Preview Mode */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <article>
              {/* Preview Header */}
              <header className="mb-8">
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tag, index) => (
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

                <h1 className="text-3xl md:text-4xl font-bold text-darkGray mb-6 leading-tight">
                  {formData.title || 'Your Article Title'}
                </h1>

                <div className="flex items-center text-gray-600 border-b border-gray-200 pb-6">
                  <span className="font-medium">{userData?.name}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date().toLocaleDateString('en-IN')}</span>
                  <span className="mx-2">•</span>
                  <span className="text-orange-600 font-medium">Updated</span>
                </div>
              </header>

              {/* Preview Image */}
              {formData.imageUrl && (
                <div className="mb-8">
                  <img
                    src={formData.imageUrl}
                    alt="Article preview"
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Preview Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 text-lg leading-relaxed">
                  {formData.content ? formatContent(formData.content) : (
                    <p className="text-gray-400 italic">Your article content will appear here...</p>
                  )}
                </div>
              </div>
            </article>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label htmlFor="title" className="block text-sm font-medium text-darkGray mb-2">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all duration-300 text-lg"
                placeholder="Enter an engaging title for your article"
                required
              />
            </div>

            {/* Image URL */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-darkGray mb-2">
                <FontAwesomeIcon icon={faImage} className="mr-2 text-saffron" />
                Featured Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all duration-300"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-2">
                Paste a direct link to an image. Recommended size: 800x400px or larger.
              </p>
              {formData.imageUrl && (
                <div className="mt-4">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-sm font-medium text-darkGray mb-2">
                <FontAwesomeIcon icon={faTag} className="mr-2 text-green" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-saffron/10 text-saffron text-sm font-medium rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-saffron hover:text-red-600 transition-colors duration-300"
                    >
                      <FontAwesomeIcon icon={faTimes} size="sm" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Add a tag and press Enter"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-sm font-medium text-darkGray mb-4">
                Article Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Write your article content here. Use the toolbar above to format your text with bold, italic, headings, lists, and more..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Use the formatting toolbar to style your content. You can add headings, bold/italic text, lists, quotes, links, and more.
              </p>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    <span>Update Article</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPost;
