import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faArrowLeft,
  faImage,
  faTag,
  faTimes,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { createPost } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';

const NewPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

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
        tags: formData.tags,
        authorId: currentUser.uid,
        authorName: userData.name
      };

      const postId = await createPost(postData);
      navigate(`/post/${postId}`);
    } catch (error) {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content) => {
    // For rich text content, we'll render it as HTML
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

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
                <h1 className="text-2xl font-bold text-darkGray">Create New Article</h1>
                <p className="text-gray-600">Share your knowledge with the world</p>
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
                    : 'bg-gradient-to-r from-saffron to-green hover:from-orange-600 hover:to-green-700 transform hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    <span>Publish Article</span>
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

export default NewPost;
