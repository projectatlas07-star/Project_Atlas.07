'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

export default function TasksPage() {
  const { session, loading } = useSupabase();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    dueDate: '',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    loadTasks();
  }, [session, router]);

  const loadTasks = async () => {
    try {
      const data = await apiFetch<Task[]>('/tasks');
      setTasks(data);
    } catch (e: any) {
      setStatus(`Error loading: ${e.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setStatus('Task created');
      setShowForm(false);
      setFormData({ title: '', description: '', status: 'open', dueDate: '' });
      loadTasks();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
      setStatus('Task deleted');
      loadTasks();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus('Task updated');
      loadTasks();
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--color-info)] text-[var(--foreground)] rounded hover:bg-[var(--color-info)]"
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {status && <p className="mb-4 text-sm text-[var(--neutral-gray-600)]">{status}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-surface p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block mb-1 text-sm font-medium text-[var(--neutral-gray-700)]">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-[var(--neutral-gray-700)]">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="status" className="block mb-1 text-sm font-medium text-[var(--neutral-gray-700)]">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block mb-1 text-sm font-medium text-[var(--neutral-gray-700)]">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-2 bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-[var(--color-success)] text-[var(--foreground)] rounded hover:bg-[var(--color-success)]"
          >
            Save Task
          </button>
        </form>
      )}

      <div className="bg-surface rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[var(--background-alt)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[var(--neutral-gray-500)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">{task.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  <select
                    aria-label={`Task status for ${task.title}`}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="p-1 text-xs bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] rounded text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-[var(--brand-cyan)] disabled:opacity-60 transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)]"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">{task.dueDate || '-'}</td>
                <td className="px-6 py-4 text-sm text-[var(--foreground)] max-w-xs truncate">{task.description || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-[var(--color-error)] hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-[var(--neutral-gray-500)]">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
