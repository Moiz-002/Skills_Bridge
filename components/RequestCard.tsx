'use client';

import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface RequestCardProps {
  id: string;
  skillTitle: string;
  studentName: string;
  teacherName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  isReceived?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  isLoading?: boolean;
}

export default function RequestCard({
  id,
  skillTitle,
  studentName,
  teacherName,
  status,
  createdAt,
  isReceived = false,
  onAccept,
  onReject,
  isLoading = false,
}: RequestCardProps) {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-50 border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    accepted: {
      color: 'bg-green-50 border-green-200',
      badge: 'bg-green-100 text-green-800',
      icon: CheckCircle,
    },
    rejected: {
      color: 'bg-red-50 border-red-200',
      badge: 'bg-red-100 text-red-800',
      icon: XCircle,
    },
    completed: {
      color: 'bg-blue-50 border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      icon: CheckCircle,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`rounded-lg border-2 ${config.color} p-6 hover:shadow-md transition`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{skillTitle}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {isReceived ? (
              <>
                <span className="font-semibold">{studentName}</span> wants to
                learn this skill
              </>
            ) : (
              <>
                You requested to learn from <span className="font-semibold">{teacherName}</span>
              </>
            )}
          </p>
        </div>

        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.badge}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-xs font-semibold capitalize">{status}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-300">
        <span className="text-xs text-gray-500">{formattedDate}</span>

        {isReceived && status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onReject?.(id)}
              disabled={isLoading}
              className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 transition disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => onAccept?.(id)}
              disabled={isLoading}
              className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
