import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ContactMethod } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';

const ContactAdmin: React.FC = () => {
  const [methods, setMethods] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<ContactMethod>>({
    label: '',
    value: '',
    type: 'email',
    sort_order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_methods')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMethods(data || []);
    } catch (error) {
      console.error('Error fetching contact methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('contact_methods')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_methods')
          .insert(formData);
        if (error) throw error;
      }
      
      setFormData({
        label: '',
        value: '',
        type: 'email',
        sort_order: 0
      });
      setIsEditing(false);
      setEditingId(null);
      fetchMethods();
    } catch (error) {
      console.error('Error saving contact method:', error);
    }
  };

  const handleEdit = (method: ContactMethod) => {
    setFormData(method);
    setIsEditing(true);
    setEditingId(method.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_methods')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchMethods();
    } catch (error) {
      console.error('Error deleting contact method:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? 'Edit Contact Method' : 'Add New Contact Method'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'email' | 'social' | 'other' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
              required
            >
              <option value="email">Email</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
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
                    label: '',
                    value: '',
                    type: 'email',
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
              {isEditing ? 'Update Method' : 'Add Method'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Contact Methods List</h2>
        <div className="space-y-4">
          {methods.map((method) => (
            <div key={method.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{method.label}</h3>
                  <p className="text-gray-600">{method.value}</p>
                  <p className="text-gray-500 text-sm">Type: {method.type} | Order: {method.sort_order}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(method)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id!)}
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

export default ContactAdmin;