'use client';

import { useState } from 'react';
import { authenticateUser } from '@/app/actions/auth';

interface CourseCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export default function CourseCard({ title, subtitle, description, icon }: CourseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('CourseCard rendered:', { title, isOpen });

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authenticateUser(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (e) {
      // redirect가 발생하면 에러가 throw되는데, 이는 정상 동작입니다
      console.log('Redirecting...', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="paper-card">
      <button
        onClick={() => {
          console.log('Card clicked, toggling from', isOpen, 'to', !isOpen);
          setIsOpen(!isOpen);
        }}
        className="w-full text-left"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">{icon}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-blue-600 font-medium mb-2">{subtitle}</p>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="text-gray-400">
            <svg
              className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Password to Access
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password..."
                className="search-input"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Authenticating...' : 'Enter Study Room →'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
