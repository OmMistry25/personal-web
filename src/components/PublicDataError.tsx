import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from './PageTransition';

interface PublicDataErrorProps {
  backTo: string;
}

const PublicDataError: React.FC<PublicDataErrorProps> = ({ backTo }) => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative flex items-center justify-center px-4">
        <p role="alert" className="text-lg text-neutral-600 text-center">
          Unable to load this page.
        </p>

        <Link
          to={backTo}
          aria-label="Go back"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Home className="w-6 h-6 text-neutral-600" />
        </Link>
      </div>
    </PageTransition>
  );
};

export default PublicDataError;
