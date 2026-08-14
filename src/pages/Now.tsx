import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { NowItem } from '../types';
import { supabase } from '../lib/supabase';

const Now: React.FC = () => {
  const [activities, setActivities] = useState<NowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('now_items')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
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
          <div className="flex flex-wrap justify-center gap-y-4 md:gap-y-0">
            {activities.map((item, index) => (
              <React.Fragment key={item.id}>
                <span className="group">
                  <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                    {item.activity}
                  </h2>
                </span>
                {index < activities.length - 1 && (
                  <span className="text-2xl md:text-4xl font-serif font-light mx-2 text-neutral-400">
                    ·
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

export default Now;