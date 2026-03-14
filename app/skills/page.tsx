'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SkillCard from '@/components/SkillCard';
import Link from 'next/link';
import { Loader, AlertCircle, Search, Filter } from 'lucide-react';

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

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const categories = [
    'all',
    'Programming',
    'Design',
    'Languages',
    'Business',
    'Creative',
    'Other',
  ];

  useEffect(() => {
    const checkAuthAndFetchSkills = async () => {
      try {
        // Try to verify auth (optional - not required for viewing skills)
        try {
          const verifyResponse = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include',
          });

          if (verifyResponse.ok) {
            const authData = await verifyResponse.json();
            if (authData.authenticated && authData.user) {
              setUserId(authData.user.userId);
            }
          }
        } catch (err) {
          // Auth check failed, but that's okay - skills page is public
          console.debug('Auth check skipped for public page');
        }

        // Fetch skills
        const response = await fetch('/api/skills');
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills);
          setFilteredSkills(data.skills);
        } else {
          setError('Failed to fetch skills');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchSkills();
  }, []);

  useEffect(() => {
    let filtered = skills;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (skill) =>
          skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((skill) => skill.category === selectedCategory);
    }

    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory, skills]);

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
              Skill Marketplace
            </h1>
            <p className="text-gray-600">
              Explore skills offered by our community members
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} found
              </p>
              {userId && (
                <Link
                  href="/skills/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  + Add Your Skill
                </Link>
              )}
            </div>
          </div>

          {/* Skills Grid */}
          {filteredSkills.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg">No skills found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill._id}
                  id={skill._id}
                  title={skill.title}
                  description={skill.description}
                  category={skill.category}
                  creatorName={skill.createdBy.name}
                  isOwner={userId === skill.createdBy._id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
