import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PublicDataError from '../components/PublicDataError';
import {
  getAboutItems,
  getAboutVideo,
  type AboutItem,
} from '../lib/public-data';

const About: React.FC = () => {
  const [items, setItems] = useState<AboutItem[]>([]);
  const [videoId, setVideoId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch about items
        const itemsData = await getAboutItems();
        setItems(itemsData);

        try {
          // Fetch video ID
          const videoData = await getAboutVideo();
          if (videoData && videoData.length > 0 && videoData[0].video_id) {
            setVideoId(videoData[0].video_id);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
    </div>;
  }

  if (hasError) {
    return <PublicDataError backTo="/" />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white relative flex items-center">
        <div className="w-full px-4 py-20 md:py-0">
          {videoId && (
            <div className="container-custom mb-12">
              <div className="relative w-full aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                  src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-y-4 md:gap-y-0">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <span className="group">
                  <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight text-neutral-200 transition-colors duration-500 group-hover:text-neutral-900">
                    {item.title}
                  </h2>
                </span>
                {index < items.length - 1 && (
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

export default About;
