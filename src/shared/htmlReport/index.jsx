import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, Type, X, Layout, Plus, Move } from 'lucide-react';
import ReactQuill from 'react-quill';
// import ReactCrop from 'react-image-crop';
import 'react-quill/dist/quill.snow.css';
// import 'react-image-crop/dist/ReactCrop.css';

const BlockTypes = {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    TEXT_IMAGE: 'text_image',
};

const HtmlReport1 = ({ onSave = () => false, onCancel = () => false }) => {
    const [blocks, setBlocks] = useState([
        { id: '1', type: BlockTypes.TEXT_IMAGE, content: { text: '', image: null }, imagePosition: 'right' },
    ]);
    const [activeBlock, setActiveBlock] = useState(null);
    const [isPreview, setIsPreview] = useState(false);
    const quillRefs = useRef({});
    const fileInputRefs = useRef({});

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'align',
        'blockquote', 'code-block',
        'list', 'bullet',
        'link'
    ];

    const handleAddBlock = (type, position = blocks.length) => {
        const newBlock = {
            id: Date.now().toString(),
            type,
            content: type === BlockTypes.TEXT_IMAGE ? { text: '', image: null } : ''
        };
        if (type === BlockTypes.TEXT_IMAGE) {
            newBlock.imagePosition = 'right';
        }
        const newBlocks = [...blocks];
        newBlocks.splice(position + 1, 0, newBlock);
        setBlocks(newBlocks);
    };

    const handleDeleteBlock = (index) => {
        if (blocks.length > 1) {
            const newBlocks = blocks.filter((_, i) => i !== index);
            setBlocks(newBlocks);
        }
    };

    const handleMoveBlock = (fromIndex, toIndex) => {
        if (toIndex >= 0 && toIndex < blocks.length) {
            const newBlocks = [...blocks];
            const [moved] = newBlocks.splice(fromIndex, 1);
            newBlocks.splice(toIndex, 0, moved);
            setBlocks(newBlocks);
        }
    };

    const handleFileUpload = (index) => {
        fileInputRefs.current[index]?.click();
    };

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const newBlocks = [...blocks];
            newBlocks[index].content = reader.result;
            setBlocks(newBlocks);
        };
        reader.readAsDataURL(file);
    };

    const handleTextImageContent = (blockId, type, content) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    content: {
                        ...block.content,
                        [type]: content
                    }
                };
            }
            return block;
        }));
    };

    const toggleImagePosition = (blockId) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    imagePosition: block.imagePosition === 'right' ? 'left' : 'right'
                };
            }
            return block;
        }));
    };

    const handleFocus = (blockId) => {
        setActiveBlock(blockId);
    };

    const renderBlock = (block, index) => {
        if (block.type === BlockTypes.TEXT_IMAGE) {
            return renderTextImageBlock(block, index);
        }

        const isActive = activeBlock === block.id;

        return (
            <div key={block.id} className={`group relative p-4 border rounded-lg mb-4 ${isActive ? 'border-blue-500' : 'border-gray-200'}`}>
                <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-sm px-1 py-1 z-50">
                    <button onClick={() => handleMoveBlock(index, index - 1)} className="p-1.5 rounded hover:bg-gray-100" disabled={index === 0}>
                        <Move className="w-4 h-4 transform rotate-180" />
                    </button>
                    <button onClick={() => handleMoveBlock(index, index + 1)} className="p-1.5 rounded hover:bg-gray-100" disabled={index === blocks.length - 1}>
                        <Move className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteBlock(index)} className="p-1.5 rounded hover:bg-gray-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {block.type === BlockTypes.TEXT ? (
                    <div className="text-editor-wrapper">
                        <ReactQuill
                            ref={el => quillRefs.current[block.id] = el}
                            theme="snow"
                            value={block.content}
                            onChange={(content) => {
                                const newBlocks = [...blocks];
                                newBlocks[index].content = content;
                                setBlocks(newBlocks);
                            }}
                            onFocus={() => handleFocus(block.id)}
                            modules={modules}
                            formats={formats}
                            className="editor-container"
                        />
                    </div>
                ) : (
                    <div className="min-h-[300px] flex items-center justify-center">
                        {block.content ? (
                            block.type === BlockTypes.VIDEO ? (
                                <video src={block.content} controls className="max-h-[400px] rounded" />
                            ) : (
                                <img src={block.content} alt="" className="max-h-[400px] rounded object-contain" />
                            )
                        ) : (
                            <div onClick={() => handleFileUpload(index)} className="cursor-pointer text-center">
                                {block.type === BlockTypes.IMAGE ? (
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                ) : (
                                    <Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                )}
                                <p className="text-sm text-gray-500">Click to add {block.type}</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={el => fileInputRefs.current[index] = el}
                            accept={block.type === BlockTypes.IMAGE ? 'image/*' : 'video/*'}
                            className="hidden"
                            onChange={(e) => handleFileChange(index, e)}
                        />
                    </div>
                )}
            </div>
        );
    };

    const renderTextImageBlock = (block, index) => {
        const isActive = activeBlock === block.id;
        const imageOnRight = block.imagePosition === 'right';

        return (
            <div key={block.id} className={`group relative p-4 border rounded-lg mb-4 ${isActive ? 'border-blue-500' : 'border-gray-200'}`}>
                <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-sm px-1 py-1 z-50">
                    <button onClick={() => toggleImagePosition(block.id)} className="p-1.5 rounded hover:bg-gray-100" title={`Move image to ${imageOnRight ? 'left' : 'right'}`}>
                        <Layout className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleMoveBlock(index, index - 1)} className="p-1.5 rounded hover:bg-gray-100" disabled={index === 0}>
                        <Move className="w-4 h-4 transform rotate-180" />
                    </button>
                    <button onClick={() => handleMoveBlock(index, index + 1)} className="p-1.5 rounded hover:bg-gray-100" disabled={index === blocks.length - 1}>
                        <Move className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteBlock(index)} className="p-1.5 rounded hover:bg-gray-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className={`flex gap-4 ${imageOnRight ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex-1 relative">
                        <ReactQuill
                            ref={el => quillRefs.current[block.id] = el}
                            theme="snow"
                            value={block.content.text}
                            onChange={(content) => handleTextImageContent(block.id, 'text', content)}
                            onFocus={() => handleFocus(block.id)}
                            modules={modules}
                            formats={formats}
                            className="editor-container"
                        />
                    </div>

                    <div className="w-1/3 flex-shrink-0">
                        {block.content.image ? (
                            <div className="relative group/image">
                                <img src={block.content.image} alt="" className="w-full h-[200px] object-cover rounded" />
                                <button
                                    onClick={() => handleTextImageContent(block.id, 'image', null)}
                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover/image:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRefs.current[block.id].click()}
                                className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                            >
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Add Image</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={el => fileInputRefs.current[block.id] = el}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        handleTextImageContent(block.id, 'image', reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderPreview = () => {
        return (
            <div className="bg-white border border-gray-200 rounded-md relative max-h-[400] overflow-auto">
                <button
                    onClick={onCancel}
                    className="absolute right-4 top-4 z-50 p-1 rounded-full bg-[#00BDD6] hover:bg-[#00aac2] transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
                <div className="max-w-4xl mx-auto bg-white min-h-screen">
                    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                        <div className="flex justify-between items-center max-w-3xl mx-auto">
                            <h2 className="text-lg font-semibold text-gray-800">Preview Mode</h2>
                            {/* <button
                onClick={() => setIsPreview(false)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
              >
                Back to Editor
              </button> */}
                        </div>
                    </div>

                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="preview-content space-y-8">
                            {blocks.map((block, index) => {
                                if (block.type === BlockTypes.TEXT_IMAGE) {
                                    const imageOnRight = block.imagePosition === 'right';
                                    return (
                                        <div key={block.id} className="preview-block">
                                            <div className={`flex gap-8 items-start ${imageOnRight ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <div className="flex-1 preview-text">
                                                    <div
                                                        className="prose prose-lg max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: block.content.text }}
                                                    />
                                                </div>
                                                {block.content.image && (
                                                    <div className="w-1/3 flex-shrink-0">
                                                        <div className="relative rounded-lg overflow-hidden shadow-md">
                                                            <img src={block.content.image} alt="" className="w-full h-auto object-cover" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }

                                if (block.type === BlockTypes.TEXT) {
                                    return (
                                        <div key={block.id} className="preview-block">
                                            <div
                                                className="prose prose-lg max-w-none"
                                                dangerouslySetInnerHTML={{ __html: block.content }}
                                            />
                                        </div>
                                    );
                                }

                                if (block.type === BlockTypes.IMAGE) {
                                    return (
                                        <div key={block.id} className="preview-block">
                                            <div className="rounded-lg overflow-hidden shadow-md">
                                                <img src={block.content} alt="" className="w-full h-auto object-contain max-h-[600px]" />
                                            </div>
                                        </div>
                                    );
                                }

                                if (block.type === BlockTypes.VIDEO) {
                                    return (
                                        <div key={block.id} className="preview-block">
                                            <div className="rounded-lg overflow-hidden shadow-md">
                                                <video src={block.content} controls className="w-full">
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </div>

                        <div className="flex justify-center gap-6 mt-10 pb-8">
                            <button
                                onClick={() => setIsPreview(false)}
                                className="px-6 py-2 bg-white border border-gray-600 rounded-sm text-gray-700 hover:bg-gray-50 min-w-[160px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onSave({ blocks })}
                                className="px-6 py-2 bg-[#2563EB] text-white rounded-sm hover:bg-[#1d4ed8] min-w-[160px]"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isPreview) return renderPreview();

    return (
        <div className="bg-white border border-gray-200 rounded-xl relative  ">
            <button
                onClick={onCancel}
                className="absolute right-4 top-4 z-50 p-1 rounded-full bg-[#00BDD6] hover:bg-[#00aac2] transition-colors"
            >
                <X className="w-5 h-5 text-white" onClick={onCancel} />
            </button>
            <div className="max-w-4xl mx-auto bg-white ">
                <div className="p-6 mt-10 max-h-[500px] overflow-auto">
                    {blocks.map((block, index) => renderBlock(block, index))}

                    <div className="flex justify-center gap-4 py-4 border rounded-lg border-dashed">
                        <button onClick={() => handleAddBlock(BlockTypes.TEXT)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
                            <Plus className="w-4 h-4" />
                            <Type className="w-4 h-4" />
                            Add Text
                        </button>
                        <button onClick={() => handleAddBlock(BlockTypes.TEXT_IMAGE)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
                            <Plus className="w-4 h-4" />
                            <Layout className="w-4 h-4" />
                            Add Text + Image
                        </button>
                        <button onClick={() => handleAddBlock(BlockTypes.IMAGE)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
                            <Plus className="w-4 h-4" />
                            <ImageIcon className="w-4 h-4" />
                            Add Image
                        </button>
                        <button onClick={() => handleAddBlock(BlockTypes.VIDEO)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
                            <Plus className="w-4 h-4" />
                            <Video className="w-4 h-4" />
                            Add Video
                        </button>
                    </div>


                </div>
                <div className="flex justify-center gap-6 mt-10">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-white border border-gray-600 rounded-sm text-gray-700 hover:bg-gray-50 min-w-[160px]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => setIsPreview(true)}
                        className="px-6 py-2 bg-[#00BDD6] text-white rounded-sm hover:bg-[#00aac2] min-w-[160px]"
                    >
                        Preview
                    </button>
                    <button
                        onClick={() => onSave({ blocks })}
                        className="px-6 py-2 bg-[#2563EB] text-white rounded-sm hover:bg-[#1d4ed8] min-w-[160px]"
                    >
                        Save
                    </button>
                </div>
                <style>{`
       .editor-container {
         min-height: 150px;
       }
       
       .ql-container.ql-snow {
         border: none;
       }
       
       .ql-editor {
         min-height: 100px;
         padding: 1rem;
       }

       .ql-editor p {
         margin: 0;
       }

       .ql-toolbar.ql-snow {
         border: none;
         border-bottom: 1px solid #e5e7eb;
         padding: 6px;
         background: white;
         position: sticky;
         top: 0;
         z-index: 40;
       }

       .text-editor-wrapper {
         border: 1px solid #e5e7eb;
         border-radius: 0.375rem;
         overflow: hidden;
       }

       .text-editor-wrapper .ql-container {
         background: white;
       }

       .text-editor-wrapper .ql-toolbar {
         border-bottom: 1px solid #e5e7eb;
       }

       .ql-toolbar button {
         width: 28px;
         height: 28px;
         padding: 3px;
         cursor: pointer;
       }

       .ql-toolbar button:hover {
         background: #f3f4f6;
         border-radius: 4px;
       }

       .ql-formats {
         display: inline-flex;
         align-items: center;
         margin-right: 8px;
       }

       .ql-toolbar button.ql-active {
         background-color: #e5e7eb;
         padding: 3px;
       }

       .ql-toolbar button:focus,
       .ql-toolbar button.ql-active:focus {
         outline: none;
         box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
       }

       .ql-editor.ql-blank::before {
         font-style: normal;
         color: #9ca3af;
         left: 1rem;
         right: 1rem;
       }

       .prose {
         max-width: none;
       }

       .prose p {
         margin: 0.75em 0;
       }

       .prose h1 {
         font-size: 1.875em;
         margin: 1em 0;
         font-weight: 600;
       }

       .prose h2 {
         font-size: 1.5em;
         margin: 1em 0;
         font-weight: 600;
       }

       .prose ul, .prose ol {
         padding-left: 1.5em;
         margin: 0.75em 0;
       }

       .prose li {
         margin: 0.375em 0;
       }

       .prose blockquote {
         border-left: 4px solid #e5e7eb;
         padding-left: 1em;
         color: #4b5563;
       }

       .prose code {
         background: #f3f4f6;
         padding: 0.2em 0.4em;
         border-radius: 0.25em;
         font-size: 0.875em;
       }

       button:disabled {
         opacity: 0.5;
         cursor: not-allowed;
       }

       .ql-snow.ql-toolbar button {
         display: inline-flex;
         align-items: center;
         justify-content: center;
         padding: 0.25rem;
         border-radius: 0.25rem;
       }

       .ql-snow.ql-toolbar .ql-formats {
         margin-right: 0.5rem;
       }

       .ql-snow .ql-picker.ql-header {
         width: auto;
       }

       .ql-snow .ql-picker.ql-header .ql-picker-label {
         padding: 0.12rem 2rem;
         border: 1px solid #e5e7eb;
         border-radius: 0.25rem;
       }

       .ql-snow .ql-picker.ql-header .ql-picker-options {
         border: 1px solid #e5e7eb;
         border-radius: 0.375rem;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
       }

       .ql-snow .ql-picker.ql-header .ql-picker-item {
         padding: 0.375rem 0.75rem;
       }

       .ql-snow .ql-tooltip {
         border: 1px solid #e5e7eb;
         border-radius: 0.375rem;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
         padding: 0.5rem;
       }

       .ql-snow .ql-tooltip input[type=text] {
         border: 1px solid #e5e7eb;
         border-radius: 0.25rem;
         padding: 0.25rem 0.5rem;
       }

       @media (max-width: 768px) {
         .editor-container {
           min-height: 100px;
         }

         .ql-toolbar.ql-snow {
           overflow-x: auto;
           white-space: nowrap;
           -webkit-overflow-scrolling: touch;
           padding: 8px;
         }

         .flex-row, .flex-row-reverse {
           flex-direction: column !important;
         }

         .w-1/3 {
           width: 100% !important;
           margin-top: 1rem;
         }
       }

       .ReactCrop__crop-selection {
         border: 2px solid white;
       }

       .ReactCrop__drag-handle {
         background-color: white;
       }

       .ReactCrop__drag-handle::after {
         background-color: white;
       }

       .ReactCrop__drag-bar {
         background-color: rgba(255, 255, 255, 0.5);
       }
     `}</style>
            </div>
        </div>
    );
};

export default HtmlReport1;