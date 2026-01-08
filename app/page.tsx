import CourseCard from '@/components/CourseCard';

export default function PortalPage() {
  const courses = [
    {
      id: 'physics-ii',
      title: 'Physics II',
      subtitle: 'Winter 2026',
      description: 'Halliday 12th Edition - Oscillations, Waves, Thermodynamics, Electromagnetism, and Optics',
      icon: '⚛️',
    },
    // Add more courses here in the future
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📚 Cait&apos;s Study Archive
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A personal collection of study materials, formulas, and practice problems
          </p>
          <div className="mt-6 inline-block">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <span className="text-sm text-gray-500">🔒 Password-protected content</span>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Courses</h2>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              subtitle={course.subtitle}
              description={course.description}
              icon={course.icon}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block paper-card bg-gray-50 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Welcome to My Study Space 👋
            </h3>
            <p className="text-sm text-gray-600">
              This is a private study archive containing course materials, notes, and practice problems.
              Click on any course card above and enter the password to access the content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
