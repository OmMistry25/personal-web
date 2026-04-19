import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { Note as NoteType } from '../types';
import { supabase } from '../lib/supabase';

const Note: React.FC = () => {
  const { slug } = useParams();
  const [note, setNote] = useState<NoteType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
      </div>
    );
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative flex items-center">
        <div className="w-full px-4">
          <div className="container-custom">
            <article className="prose prose-neutral max-w-none">
              <h1 className="text-4xl sm:text-5xl font-light mb-8 text-neutral-900">{note.title}</h1>
              
              <div className="flex items-center gap-4 text-neutral-500 mb-8 text-lg">
                <time>{note.date}</time>
                <span>·</span>
                <span>{note.reading_time} min read</span>
              </div>

              <div className="mb-12 flex gap-2">
                {note.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-block bg-neutral-100 px-3 py-1 text-sm text-neutral-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-lg leading-relaxed text-neutral-800 whitespace-pre-wrap">
                {note.content}
              </div>
            </article>
          </div>
        </div>

        <Link 
          to="/writing"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Home className="w-6 h-6 text-neutral-600" />
        </Link>
      </div>
    </PageTransition>
  );
};

export default Note;