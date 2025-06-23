import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = "Write your article content here..." }) => {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: '400px',
          marginBottom: '50px'
        }}
      />
      
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border: 1px solid #d1d5db;
          border-radius: 8px 8px 0 0;
          background: #f9fafb;
        }
        
        .rich-text-editor .ql-container {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 8px 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 350px;
          padding: 20px;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #374151;
        }
        
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #374151;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-stroke {
          stroke: #FF9933;
        }
        
        .rich-text-editor .ql-toolbar button:hover .ql-fill {
          fill: #FF9933;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #FF9933;
        }
        
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #FF9933;
        }
        
        .rich-text-editor .ql-editor h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
        }
        
        .rich-text-editor .ql-editor h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 1.25rem 0 0.75rem 0;
        }
        
        .rich-text-editor .ql-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 1rem 0 0.5rem 0;
        }
        
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #FF9933;
          background: linear-gradient(135deg, rgba(255, 153, 51, 0.1), rgba(19, 136, 8, 0.05));
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #374151;
        }
        
        .rich-text-editor .ql-editor .ql-align-center {
          text-align: center;
        }
        
        .rich-text-editor .ql-editor .ql-align-right {
          text-align: right;
        }
        
        .rich-text-editor .ql-editor .ql-align-justify {
          text-align: justify;
        }
        
        .rich-text-editor .ql-editor ul, 
        .rich-text-editor .ql-editor ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .rich-text-editor .ql-editor li {
          margin: 0.5rem 0;
        }
        
        .rich-text-editor .ql-editor a {
          color: #FF9933;
          text-decoration: underline;
        }
        
        .rich-text-editor .ql-editor a:hover {
          color: #e6851a;
        }
        
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }
        
        .rich-text-editor .ql-editor .ql-code-block-container {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          margin: 1rem 0;
        }
        
        .rich-text-editor .ql-editor .ql-code-block {
          background: transparent;
          color: #374151;
          font-family: 'Courier New', monospace;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
