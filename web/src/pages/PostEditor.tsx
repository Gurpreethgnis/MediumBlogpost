import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline as UnderlineIcon,
  Highlighter,
  Table as TableIcon,
  Save,
  Eye,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { Post, CreatePostData, UpdatePostData } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    excerpt: '',
    content: '',
    visibility: 'ORG',
    spaceId: undefined,
    featuredImage: '',
    tags: [],
    inviteeEmails: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [inviteeInput, setInviteeInput] = useState('');

  // Fetch existing post if editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery(
    ['post', id],
    async () => {
      const response = await api.get(`/posts/${id}`);
      return response.data.post;
    },
    {
      enabled: isEditing,
      onSuccess: (post: Post) => {
        setFormData({
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content,
          visibility: post.visibility,
          spaceId: post.spaceId,
          featuredImage: post.featuredImage || '',
          tags: post.tags.map(t => t.name),
          inviteeEmails: post.invitees.map(u => u.email),
        });
      },
    }
  );

  // Create/Update post mutation
  const mutation = useMutation(
    async (data: CreatePostData | UpdatePostData) => {
      if (isEditing) {
        const response = await api.put(`/posts/${id}`, data);
        return response.data;
      } else {
        const response = await api.post('/posts', data);
        return response.data;
      }
    },
    {
      onSuccess: (data) => {
        toast.success(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
        queryClient.invalidateQueries(['posts']);
        navigate(`/post/${data.post.id}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Something went wrong');
      },
    }
  );

  // Publish/Unpublish mutation
  const publishMutation = useMutation(
    async (action: 'publish' | 'unpublish') => {
      const response = await api.patch(`/posts/${id}/publish`, { action });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success(`Post ${data.action === 'publish' ? 'published' : 'unpublished'} successfully!`);
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['post', id]);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error?.message || 'Something went wrong');
      },
    }
  );

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight,
      CodeBlock,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Update editor content when form data changes
  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [editor, formData.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }
    mutation.mutate(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleAddInvitee = () => {
    if (inviteeInput.trim() && !formData.inviteeEmails.includes(inviteeInput.trim())) {
      setFormData(prev => ({ ...prev, inviteeEmails: [...prev.inviteeEmails, inviteeInput.trim()] }));
      setInviteeInput('');
    }
  };

  const handleRemoveInvitee = (emailToRemove: string) => {
    setFormData(prev => ({ ...prev, inviteeEmails: prev.inviteeEmails.filter(email => email !== emailToRemove) }));
  };

  if (isLoadingPost) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Post' : 'Write a New Post'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update your post content and settings' : 'Share your story with your organization'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                placeholder="Enter your post title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="input"
                rows={3}
                placeholder="Brief description of your post..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                className="input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Visibility Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visibility Settings</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                className="input"
              >
                <option value="ORG">Organization-wide</option>
                <option value="SPACE">Space members only</option>
                <option value="PRIVATE">Private (invite only)</option>
              </select>
            </div>

            {formData.visibility === 'PRIVATE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invite People</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inviteeInput}
                    onChange={(e) => setInviteeInput(e.target.value)}
                    className="input flex-1"
                    placeholder="Enter email address..."
                  />
                  <button
                    type="button"
                    onClick={handleAddInvitee}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
                {formData.inviteeEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.inviteeEmails.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveInvitee(email)}
                          className="ml-1 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="input flex-1"
              placeholder="Enter tag name..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary"
            >
              Add Tag
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Editor Toolbar */}
        <div className="card p-4">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-4">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded ${editor?.isActive('underline') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded ${editor?.isActive('highlight') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Highlighter className="w-4 h-4" />
            </button>
            
            <div className="w-px bg-gray-300 mx-2"></div>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded ${editor?.isActive('bulletList') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded ${editor?.isActive('orderedList') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded ${editor?.isActive('blockquote') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Quote className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded ${editor?.isActive('codeBlock') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Code className="w-4 h-4" />
            </button>
            
            <div className="w-px bg-gray-300 mx-2"></div>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            
            <div className="w-px bg-gray-300 mx-2"></div>
            
            <button
              type="button"
              onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="p-2 rounded text-gray-600 hover:bg-gray-100"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Editor Content */}
          <div className="min-h-[400px] prose prose-gray max-w-none">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => publishMutation.mutate('publish')}
                  disabled={publishMutation.isLoading}
                  className="btn-primary"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {publishMutation.isLoading ? 'Publishing...' : 'Publish'}
                </button>
                
                <button
                  type="button"
                  onClick={() => publishMutation.mutate('unpublish')}
                  disabled={publishMutation.isLoading}
                  className="btn-secondary"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Unpublish
                </button>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {mutation.isLoading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
