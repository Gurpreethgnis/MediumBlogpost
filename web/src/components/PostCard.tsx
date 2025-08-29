import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageCircle, Eye, Bookmark, Tag } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="post-card card-hover">
      <div className="post-card-header">
        <Link to={`/post/${post.slug}`} className="post-card-title block">
          {post.title}
        </Link>
        <p className="post-card-excerpt">
          {post.excerpt}
        </p>
      </div>

      {/* Tags */}
      <div className="post-card-tags">
        {post.tags.slice(0, 4).map((tag) => (
          <span key={tag.id} className="tag">
            {tag.name}
          </span>
        ))}
        {post.tags.length > 4 && (
          <span className="text-sm text-gray-500">
            +{post.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Meta Information */}
      <div className="post-card-meta">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-medium text-xs">
                {post.author.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {post.author.name}
            </span>
          </div>
          
          <span className="text-gray-400">•</span>
          
          <time className="text-sm text-gray-500">
            {format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}
          </time>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{post._count.claps}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post._count.comments}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{post._count.views}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
        
        <Link
          to={`/post/${post.slug}`}
          className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition-colors duration-200"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
