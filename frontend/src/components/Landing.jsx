import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to ReportMitra
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your partner in building a better community. Report civic issues easily.
          </p>
          
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link 
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
              >
                Get Started
              </Link>
              <Link 
                to="/signin"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 inline-block"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                to="/report"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
              >
                Report an Issue
              </Link>
              <Link 
                to="/track"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 inline-block"
              >
                Track Complaints
              </Link>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
              <p className="text-gray-600">Easily report civic problems with photos and location details.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor the status of your complaints in real-time.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">See how your reports contribute to city improvement.</p>
            </div>
          </div>
        </section>

        {/* Track Record Section */}
        <section className="py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">Our Track Record</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">1,200+</div>
              <div className="text-gray-600">Issues Reported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-gray-600">Resolution Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Wards Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">2,500+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;