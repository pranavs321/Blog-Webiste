import React from 'react';
import { Edit, Trash2, User } from 'lucide-react';

interface BlogProps {
  blog: any;
  onEdit?: (blog: any) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
}

const BlogCard = ({ blog, onEdit, onDelete, canEdit = false }: BlogProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold">
            {blog.category}
          </span>
          {canEdit && (
            <div className="flex gap-2">
              <button onClick={() => onEdit?.(blog)} className="text-blue-600 hover:text-blue-800 p-1">
                <Edit size={16} />
              </button>
              <button onClick={() => onDelete?.(blog._id)} className="text-red-600 hover:text-red-800 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{blog.about}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{blog.adminName}</span>
          </div>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
