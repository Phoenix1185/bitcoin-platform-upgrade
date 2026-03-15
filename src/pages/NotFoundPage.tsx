import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bitcoin, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-crypto-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-crypto-yellow/10 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-60 md:w-80 h-60 md:h-80 bg-crypto-yellow/5 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-crypto-yellow to-crypto-yellow-dark flex items-center justify-center">
              <Bitcoin className="w-6 h-6 md:w-8 md:h-8 text-crypto-dark" />
            </div>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-display font-bold text-gradient mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-crypto-border text-white hover:bg-crypto-card px-6 py-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light px-6 py-5"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
