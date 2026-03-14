'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SkillCard from '@/components/SkillCard';
import Link from 'next/link';
import { Plus, Loader, AlertCircle, User, Mail, Calendar } from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

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
  status: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use API endpoint to verify auth (can read httpOnly cookie)
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          console.log('Auth verification failed, redirecting to login');
          router.push('/login');
          return;
        }

        const authData = await response.json();

        if (!authData.authenticated || !authData.user) {
          console.log('User not authenticated');
          router.push('/login');
          return;
        }

        // Set user info from verified token
        const userObj = {
          id: authData.user.userId,
          name: 'User',
          email: authData.user.email,
        };

        setUser(userObj);

        // Fetch user skills and requests with the userId
        await Promise.all([
          fetchUserSkillsWithId(userObj.id),
          fetchRequests(),
        ]);
      } catch (err) {
        console.error('Auth check error:', err);
        setIsLoading(false);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchUserSkillsWithId = async (userId: string) => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        // Filter for user's skills
        const userSkills = data.skills.filter(
          (skill: Skill) => skill.createdBy._id === userId
        );
        setSkills(userSkills);
      }
    } catch (err) {
      console.error('Fetch skills error:', err);
      setError('Failed to fetch skills');
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSkills(skills.filter((s) => s._id !== skillId));
      } else {
        setError('Failed to delete skill');
      }
    } catch (err) {
      setError('Error deleting skill');
      console.error(err);
    }
  };

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

  if (!user) {
    return null;
  }

  const receivedRequests = requests.filter(
    (r) => r.teacherId._id === user.id
  );
  const sentRequests = requests.filter((r) => r.studentId._id === user.id);

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

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome back, {user.email.split('@')[0]}!
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Skills Offered</p>
                  <p className="font-semibold text-gray-900">{skills.length}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-4 rounded-lg">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Requests</p>
                  <p className="font-semibold text-gray-900">
                    {receivedRequests.length + sentRequests.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Skills Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Your Skills</h2>
              <Link
                href="/skills/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Skill</span>
              </Link>
            </div>

            {skills.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">
                  You haven't added any skills yet
                </p>
                <Link
                  href="/skills/create"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Create Your First Skill
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    id={skill._id}
                    title={skill.title}
                    description={skill.description}
                    category={skill.category}
                    creatorName={skill.createdBy.name}
                    isOwner={true}
                    onDelete={handleDeleteSkill}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Requests Overview */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Received Requests */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Requests for Your Skills ({receivedRequests.length})
              </h3>
              {receivedRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedRequests.slice(0, 3).map((request) => (
                    <div
                      key={request._id}
                      className="bg-white rounded-lg shadow-md p-4"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {request.skillId.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        From: {request.studentId.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 capitalize">
                        Status: <span className="font-semibold">{request.status}</span>
                      </p>
                    </div>
                  ))}
                  {receivedRequests.length > 3 && (
                    <Link
                      href="/requests"
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      View all requests →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Sent Requests */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Skills You're Learning ({sentRequests.length})
              </h3>
              {sentRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No active requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentRequests.slice(0, 3).map((request) => (
                    <div
                      key={request._id}
                      className="bg-white rounded-lg shadow-md p-4"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {request.skillId.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Teacher: {request.teacherId.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 capitalize">
                        Status: <span className="font-semibold">{request.status}</span>
                      </p>
                    </div>
                  ))}
                  {sentRequests.length > 3 && (
                    <Link
                      href="/requests"
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      View all requests →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const BookOpen = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M12 6.253v13m0-13C6.5 6.253 2 10.20 2 17.002V10a2 2 0 012-2h16a2 2 0 012 2v7.002c0-6.800-4.5-10.749-10-10.749z" />
  </svg>
);
