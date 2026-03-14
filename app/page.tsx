import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Zap, Users, BookOpen, Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'SkillBridge - Connect. Learn. Teach.',
  description: 'A skill exchange platform where users can teach and request skills from each other.',
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Connect. Learn.{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Teach.
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Share your expertise and learn new skills from our vibrant community. SkillBridge connects learners with skilled mentors in a collaborative platform designed for growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="/skills"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-blue-50 transition"
                >
                  Explore Skills
                </Link>
              </div>
            </div>

            {/* Right illustration */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 rounded-lg p-6 flex items-center justify-center h-48">
                  <BookOpen className="w-24 h-24 text-blue-600 opacity-30" />
                </div>
                <div className="bg-purple-100 rounded-lg p-6 flex items-center justify-center h-48">
                  <Award className="w-24 h-24 text-purple-600 opacity-30" />
                </div>
                <div className="bg-green-100 rounded-lg p-6 flex items-center justify-center h-48">
                  <Users className="w-24 h-24 text-green-600 opacity-30" />
                </div>
                <div className="bg-pink-100 rounded-lg p-6 flex items-center justify-center h-48">
                  <Zap className="w-24 h-24 text-pink-600 opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillBridge?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to grow your skills and help others learn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Learn New Skills
              </h3>
              <p className="text-gray-600">
                Access a diverse marketplace of skills taught by experienced mentors. Request to learn anything you're interested in.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Share Your Expertise
              </h3>
              <p className="text-gray-600">
                List your skills and connect with people who want to learn from you. Build your reputation as a mentor.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Join a vibrant community of learners and teachers. Network, collaborate, and grow together.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of learners and teachers on SkillBridge
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 SkillBridge. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
