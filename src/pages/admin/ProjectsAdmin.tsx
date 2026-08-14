import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Project } from '../../types';
import { Pencil, Trash2, MoveUp, MoveDown } from 'lucide-react';

const ProjectsAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    url: '',
    year: '',
    tags: [],
    featured: false,
    achievements: [],
    sort_order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const nextSortOrder = Math.min(...projects.map(project => project.sort_order), 1) - 1;
        const { error } = await supabase
          .from('projects')
          .insert({ ...formData, sort_order: nextSortOrder });
        if (error) throw error;
      }
      
      setFormData({
        title: '',
        description: '',
        url: '',
        year: '',
        tags: [],
        featured: false,
        achievements: [],
        sort_order: 0
      });
      setIsEditing(false);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setIsEditing(true);
    setEditingId(project.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const moveProject = async (project: Project, direction: 'up' | 'down') => {
    const currentIndex = projects.findIndex(item => item.id === project.id);
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= projects.length) return;

    const adjacentProject = projects[nextIndex];

    try {
      const { error: projectError } = await supabase
        .from('projects')
        .update({ sort_order: adjacentProject.sort_order })
        .eq('id', project.id!);
      if (projectError) throw projectError;

      const { error: adjacentError } = await supabase
        .from('projects')
        .update({ sort_order: project.sort_order })
        .eq('id', adjacentProject.id!);
      if (adjacentError) throw adjacentError;

      fetchProjects();
    } catch (error) {
      console.error('Error moving project:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? 'Edit Project' : 'Add New Project'}
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Achievements (comma-separated)</label>
            <input
              type="text"
              value={formData.achievements?.join(', ')}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value.split(',').map(achievement => achievement.trim()) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded border-gray-300 text-neutral-600 focus:ring-neutral-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Featured</label>
          </div>
          
          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    url: '',
                    year: '',
                    tags: [],
                    featured: false,
                    achievements: [],
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
              {isEditing ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Projects List</h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                  <p className="text-gray-500 text-sm mt-2">Order: {project.sort_order}</p>
                  <div className="mt-2 space-x-2">
                    {project.tags?.map((tag) => (
                      <span key={tag} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => moveProject(project, 'up')}
                    disabled={projects[0]?.id === project.id}
                    aria-label={`Move ${project.title} up`}
                    className="p-2 text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <MoveUp size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProject(project, 'down')}
                    disabled={projects[projects.length - 1]?.id === project.id}
                    aria-label={`Move ${project.title} down`}
                    className="p-2 text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <MoveDown size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id!)}
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

export default ProjectsAdmin;
