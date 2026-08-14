import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Note } from '../../types';
import { Pencil, Trash2, MoveUp, MoveDown } from 'lucide-react';

const WritingAdmin: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    slug: '',
    date: '',
    reading_time: 0,
    excerpt: '',
    content: '',
    tags: [],
    sort_order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSlugExists = async (slug: string, excludeId?: string) => {
    try {
      let query = supabase
        .from('notes')
        .select('id')
        .eq('slug', slug)
        .limit(1);
      
      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error checking slug:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking slug:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const slugExists = await checkSlugExists(formData.slug!, editingId);
      
      if (slugExists) {
        setError(`The slug "${formData.slug}" is already in use. Please choose a different slug.`);
        return;
      }

      // If not editing, set the sort_order to the highest current order + 1
      if (!isEditing) {
        const maxOrder = Math.max(...notes.map(note => note.sort_order || 0), -1);
        formData.sort_order = maxOrder + 1;
      }

      if (isEditing && editingId) {
        const { error: updateError } = await supabase
          .from('notes')
          .update(formData)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('notes')
          .insert(formData);
        if (insertError) throw insertError;
      }
      
      setFormData({
        title: '',
        slug: '',
        date: '',
        reading_time: 0,
        excerpt: '',
        content: '',
        tags: [],
        sort_order: 0
      });
      setIsEditing(false);
      setEditingId(null);
      setError(null);
      fetchNotes();
    } catch (error: any) {
      console.error('Error saving note:', error);
      setError(error.message || 'An error occurred while saving the note.');
    }
  };

  const handleEdit = (note: Note) => {
    setFormData(note);
    setIsEditing(true);
    setEditingId(note.id);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const moveNote = async (note: Note, direction: 'up' | 'down') => {
    const currentIndex = notes.findIndex(n => n.id === note.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === notes.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const otherNote = notes[newIndex];

    try {
      // Swap sort_order values
      const tempOrder = note.sort_order;
      const { error: error1 } = await supabase
        .from('notes')
        .update({ sort_order: otherNote.sort_order })
        .eq('id', note.id);

      const { error: error2 } = await supabase
        .from('notes')
        .update({ sort_order: tempOrder })
        .eq('id', otherNote.id);

      if (error1) throw error1;
      if (error2) throw error2;

      fetchNotes();
    } catch (error) {
      console.error('Error moving note:', error);
    }
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !prev.slug || prev.slug === generateSlugFromTitle(prev.title || '') 
        ? generateSlugFromTitle(title)
        : prev.slug
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? 'Edit Note' : 'Add New Note'}
        </h2>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: generateSlugFromTitle(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reading Time (minutes)</label>
            <input
              type="number"
              value={formData.reading_time}
              onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags?.join(', ')}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    slug: '',
                    date: '',
                    reading_time: 0,
                    excerpt: '',
                    content: '',
                    tags: [],
                    sort_order: 0
                  });
                  setIsEditing(false);
                  setEditingId(null);
                  setError(null);
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
              {isEditing ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Notes List</h2>
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{note.title}</h3>
                  <p className="text-gray-600">{note.excerpt}</p>
                  <div className="mt-2 space-x-2">
                    {note.tags?.map((tag) => (
                      <span key={tag} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Order: {note.sort_order}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => moveNote(note, 'up')}
                    className="p-2 text-gray-600 hover:text-gray-800"
                    disabled={notes.indexOf(note) === 0}
                  >
                    <MoveUp size={20} />
                  </button>
                  <button
                    onClick={() => moveNote(note, 'down')}
                    className="p-2 text-gray-600 hover:text-gray-800"
                    disabled={notes.indexOf(note) === notes.length - 1}
                  >
                    <MoveDown size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id!)}
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

export default WritingAdmin;