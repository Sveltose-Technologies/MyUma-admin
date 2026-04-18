// src/components/common/TextEditor.jsx
import React from "react";
import ReactQuill from "react-quill-new"; // Changed from react-quill
import "react-quill-new/dist/quill.snow.css"; // Changed CSS path

const TextEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <div className="bg-white rounded-3 overflow-hidden border-2 border">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        // Fixed height style for better UI
        style={{ height: "200px", marginBottom: "42px" }}
      />
    </div>
  );
};

export default TextEditor;
