'use client';

import Link from 'next/link';
import { Trash2, ExternalLink } from 'lucide-react';

interface SkillCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  creatorName: string;
  creatorEmail?: string;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export default function SkillCard({
  id,
  title,
  description,
  category,
  creatorName,
  isOwner = false,
  onDelete,
}: SkillCardProps) {
  const categoryColors: Record<string, string> = {
    Programming: 'bg-blue-100 text-blue-800',
    Design: 'bg-purple-100 text-purple-800',
    Languages: 'bg-green-100 text-green-800',
    Business: 'bg-orange-100 text-orange-800',
    Creative: 'bg-pink-100 text-pink-800',
    Other: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden h-full flex flex-col">
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 flex-1">{title}</h3>
          {isOwner && (
            <button
              onClick={() => onDelete?.(id)}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-md transition"
              title="Delete skill"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category */}
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              categoryColors[category] || categoryColors.Other
            }`}
          >
            {category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
          {description}
        </p>

        {/* Creator info and button */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Taught by</p>
            <p className="font-semibold text-gray-800">{creatorName}</p>
          </div>
          {!isOwner && (
            <Link
              href={`/skills/${id}`}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition"
            >
              <span className="text-sm font-medium">View</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
