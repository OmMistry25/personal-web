import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { Project } from '../types';
import { supabase } from '../lib/supabase';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative flex items-center">
        <div className="w-full px-4 py-20 md:py-0">
          <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center items-center gap-y-6 md:gap-y-0">
            {projects.map((project, index) => (
              <React.Fragment key={project.id}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900 text-center md:text-left">
                    {project.title}
                  </h2>
                </a>
                {index < projects.length - 1 && (
                  <span className="hidden md:inline text-2xl md:text-4xl font-serif font-light mx-2 text-neutral-400">
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

export default Projects;