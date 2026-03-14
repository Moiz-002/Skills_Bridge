'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { AlertCircle, Loader, ArrowLeft, Send, MessageCircle } from 'lucide-react';

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
  createdAt: string;
}

interface PageParams {
  id: string;
}

export default function SkillDetailPage() {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const params = useParams() as unknown as PageParams;
  const router = useRouter();

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch(`/api/skills/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setSkill(data.skill);
        } else {
          setError('Skill not found');
        }
      } catch (err) {
        setError('Failed to fetch skill details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSkill();
    }
  }, [params.id]);

  const handleSendRequest = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: params.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to send request');
        setIsSubmitting(false);
        return;
      }

      setRequestSent(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setIsSubmitting(false);
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

  if (!skill) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/skills"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Skills</span>
            </Link>
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">Skill not found</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  const categoryColors: Record<string, string> = {
    Programming: 'bg-blue-100 text-blue-800',
    Design: 'bg-purple-100 text-purple-800',
    Languages: 'bg-green-100 text-green-800',
    Business: 'bg-orange-100 text-orange-800',
    Creative: 'bg-pink-100 text-pink-800',
    Other: 'bg-gray-100 text-gray-800',
  };

  const formattedDate = new Date(skill.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/skills"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Skills</span>
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {requestSent && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-700 font-semibold">
                    ✓ Your learning request has been sent successfully!
                  </p>
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">{skill.title}</h1>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      categoryColors[skill.category] || categoryColors.Other
                    }`}
                  >
                    {skill.category}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Taught by <strong>{skill.createdBy.name}</strong></span>
                  </div>
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10 pb-10 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  About This Skill
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {skill.description}
                </p>
              </div>

              {/* Teacher Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Teacher</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">
                      {skill.createdBy.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">
                      {skill.createdBy.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!requestSent && (
                  <button
                    onClick={handleSendRequest}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    {isSubmitting && <Loader className="w-5 h-5 animate-spin" />}
                    <Send className="w-5 h-5" />
                    <span>
                      {isSubmitting ? 'Sending...' : 'Request to Learn'}
                    </span>
                  </button>
                )}

                <Link
                  href="/skills"
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Back to Skills
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
