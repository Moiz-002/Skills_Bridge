'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RequestCard from '@/components/RequestCard';
import Link from 'next/link';
import { Loader, AlertCircle } from 'lucide-react';

interface Request {
  _id: string;
  skillId: {
    _id: string;
    title: string;
  };
  studentId: {
    _id: string;
    name: string;
  };
  teacherId: {
    _id: string;
    name: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export default function RequestsPage() {
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'received' | 'sent'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchRequests = async () => {
      try {
        // Use API endpoint to verify auth (can read httpOnly cookie)
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (!verifyResponse.ok) {
          router.push('/login');
          return;
        }

        const authData = await verifyResponse.json();

        if (!authData.authenticated || !authData.user) {
          router.push('/login');
          return;
        }

        setUserId(authData.user.userId);

        // Fetch requests
        const response = await fetch('/api/requests', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setAllRequests(data.requests);
        } else {
          setError('Failed to fetch requests');
        }
      } catch (err) {
        console.error('Error:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchRequests();
  }, [router]);

  const handleAccept = async (requestId: string) => {
    setUpdatingId(requestId);
    try {
      const response = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: 'accepted' }),
      });

      if (response.ok) {
        setAllRequests(
          allRequests.map((r) =>
            r._id === requestId ? { ...r, status: 'accepted' } : r
          )
        );
      } else {
        setError('Failed to accept request');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setUpdatingId(requestId);
    try {
      const response = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: 'rejected' }),
      });

      if (response.ok) {
        setAllRequests(
          allRequests.map((r) =>
            r._id === requestId ? { ...r, status: 'rejected' } : r
          )
        );
      } else {
        setError('Failed to reject request');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const receivedRequests = allRequests.filter(
    (r) => r.teacherId._id === userId
  );
  const sentRequests = allRequests.filter((r) => r.studentId._id === userId);

  const displayedRequests =
    activeTab === 'received'
      ? receivedRequests
      : activeTab === 'sent'
        ? sentRequests
        : allRequests;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-96">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Skill Requests
            </h1>
            <p className="text-gray-600">
              Manage requests to learn and teach skills
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-8 border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                All Requests ({allRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === 'received'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Received ({receivedRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === 'sent'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Sent ({sentRequests.length})
              </button>
            </div>
          </div>

          {/* Requests List */}
          {displayedRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                {activeTab === 'received' && "You haven't received any requests yet"}
                {activeTab === 'sent' && "You haven't sent any requests yet"}
                {activeTab === 'all' && 'No requests found'}
              </p>
              {activeTab === 'sent' && (
                <Link
                  href="/skills"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Explore skills to request →
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  id={request._id}
                  skillTitle={request.skillId.title}
                  studentName={request.studentId.name}
                  teacherName={request.teacherId.name}
                  status={request.status}
                  createdAt={request.createdAt}
                  isReceived={request.teacherId._id === userId}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  isLoading={updatingId === request._id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
