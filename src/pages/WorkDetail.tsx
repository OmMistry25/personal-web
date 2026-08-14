import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { WorkExperience } from '../types';
import { supabase } from '../lib/supabase';

const WorkDetail: React.FC = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState<WorkExperience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const { data, error } = await supabase
          .from('work_experience')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setExperience(data);
      } catch (error) {
        console.error('Error fetching work experience:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
      </div>
    );
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative flex items-center">
        <div className="w-full px-4">
          <div className="container-custom">
            <article className="prose prose-neutral max-w-none">
              <h1 className="text-4xl sm:text-5xl font-light mb-4 text-neutral-900">{experience.role}</h1>
              <h2 className="text-2xl sm:text-3xl font-light text-neutral-600 mt-0 mb-8">{experience.company}</h2>
              
              <div className="flex items-center gap-4 text-neutral-500 mb-12 text-lg">
                <time>{experience.period}</time>
              </div>

              <div className="mb-12">
                <p className="text-lg leading-relaxed text-neutral-800">{experience.description}</p>
              </div>

              {experience.achievements.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-light mb-6 text-neutral-900">Key Achievements</h3>
                  <ul className="space-y-4 list-none pl-0">
                    {experience.achievements.map((achievement, index) => (
                      <li key={index} className="text-lg text-neutral-700">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.technologies.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-light mb-6 text-neutral-900">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map(tech => (
                      <span 
                        key={tech}
                        className="inline-block bg-neutral-100 px-3 py-1 text-sm text-neutral-600 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>

        <Link 
          to="/work"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Home className="w-6 h-6 text-neutral-600" />
        </Link>
      </div>
    </PageTransition>
  );
};

export default WorkDetail;