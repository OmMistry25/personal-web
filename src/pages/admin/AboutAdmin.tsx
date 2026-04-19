import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AboutItem } from '../../types';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';

const AboutAdmin: React.FC = () => {
  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<AboutItem>>({
    title: '',
    sort_order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchItems();
    fetchExistingVideo();
  }, []);

  const fetchExistingVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('about_video')
        .select('video_id')
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0 && data[0].video_id) {
        setVideoId(data[0].video_id);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      setErrorMessage('Error fetching existing video');
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('about_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching about items:', error);
      setErrorMessage('Error fetching about items');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Delete existing video
      const { error: deleteError } = await supabase
        .from('about_video')
        .delete()
        .not('id', 'is', null);

      if (deleteError) throw deleteError;

      // Insert new video
      const { error: insertError } = await supabase
        .from('about_video')
        .insert({ video_id: videoId });

      if (insertError) throw insertError;

      setErrorMessage('');
    } catch (error: any) {
      console.error('Error saving video:', error);
      setErrorMessage(error.message || 'Error saving video');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('about_items')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about_items')
          .insert(formData);
        if (error) throw error;
      }
      
      setFormData({
        title: '',
        sort_order: 0
      });
      setIsEditing(false);
      setEditingId(null);
      fetchItems();
    } catch (error: any) {
      console.error('Error saving about item:', error);
      setErrorMessage('Error saving about item');
    }
  };

  const handleEdit = (item: AboutItem) => {
    setFormData(item);
    setIsEditing(true);
    setEditingId(item.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error('Error deleting about item:', error);
      setErrorMessage('Error deleting about item');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Error Message Display */}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* YouTube Video Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">YouTube Video</h2>
        <form onSubmit={handleVideoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube Video ID</label>
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="e.g., 6ulOYUJHpoc"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the video ID from your YouTube URL (e.g., for https://youtube.com/watch?v=6ulOYUJHpoc, enter "6ulOYUJHpoc")
            </p>
          </div>

          {videoId && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="relative w-full aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg shadow-sm"
                  src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                  title="YouTube video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            >
              Save Video
            </button>
          </div>
        </form>
      </div>

      {/* About Items Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? 'Edit About Item' : 'Add New About Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    sort_order: 0
                  });
                  setIsEditing(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            >
              {isEditing ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>

      {/* About Items List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">About Items List</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-gray-600">Order: {item.sort_order}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;