import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ContactMethod } from '../types';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactMethods = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_methods')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setContactMethods(data || []);
      } catch (error) {
        console.error('Error fetching contact methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactMethods();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative flex items-center">
        <div className="w-full px-4 py-20 md:py-0">
          <div className="flex flex-wrap justify-center gap-2 md:gap-0">
            {contactMethods.map((method, index) => (
              <React.Fragment key={method.id}>
                <span className="group">
                  <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900 inline-block">
                    {method.type === 'email' ? (
                      <a href={`mailto:${method.value}`} className="hover:text-neutral-900">
                        {method.label}
                      </a>
                    ) : method.type === 'social' ? (
                      <a href={method.value} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900">
                        {method.label}
                      </a>
                    ) : (
                      method.label
                    )}
                  </h2>
                </span>
                {index < contactMethods.length - 1 && (
                  <span className="text-2xl md:text-4xl font-serif font-light mx-2 text-neutral-400 hidden md:inline">
                    .
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Link 
          to="/"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Home className="w-6 h-6 text-neutral-600" />
        </Link>
      </div>
    </PageTransition>
  );
};

export default Contact;