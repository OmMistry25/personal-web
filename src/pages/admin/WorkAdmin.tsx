import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { WorkExperience } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';

const WorkAdmin: React.FC = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<WorkExperience>>({
    company: '',
    role: '',
    period: '',
    description: '',
    achievements: [],
    technologies: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('work_experience')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching work experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('work_experience')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('work_experience')
          .insert(formData);
        if (error) throw error;
      }
      
      setFormData({
        company: '',
        role: '',
        period: '',
        description: '',
        achievements: [],
        technologies: []
      });
      setIsEditing(false);
      setEditingId(null);
      fetchExperiences();
    } catch (error) {
      console.error('Error saving work experience:', error);
    }
  };

  const handleEdit = (experience: WorkExperience) => {
    setFormData(experience);
    setIsEditing(true);
    setEditingId(experience.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_experience')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchExperiences();
    } catch (error) {
      console.error('Error deleting work experience:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? 'Edit Work Experience' : 'Add New Work Experience'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <input
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700">Achievements (comma-separated)</label>
            <textarea
              value={formData.achievements?.join('\n')}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value.split('\n').map(achievement => achievement.trim()) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
            <input
              type="text"
              value={formData.technologies?.join(', ')}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(tech => tech.trim()) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    company: '',
                    role: '',
                    period: '',
                    description: '',
                    achievements: [],
                    technologies: []
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
              {isEditing ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Work Experience List</h2>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{experience.role} at {experience.company}</h3>
                  <p className="text-gray-600">{experience.period}</p>
                  <p className="text-gray-600 mt-2">{experience.description}</p>
                  <div className="mt-2 space-x-2">
                    {experience.technologies?.map((tech) => (
                      <span key={tech} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id!)}
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

export default WorkAdmin;