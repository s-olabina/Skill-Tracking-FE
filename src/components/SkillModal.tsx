import React, { useState, useEffect } from 'react';
import { Skill, CreateSkillDto, SkillLevel } from '../types';
import { X } from 'lucide-react';

interface SkillModalProps {
  skill?: Skill | null;
  onClose: () => void;
  onSave: (data: CreateSkillDto) => Promise<void>;
}

const SkillModal: React.FC<SkillModalProps> = ({ skill, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateSkillDto>({
    name: '',
    category: '',
    description: '',
    level: SkillLevel.Beginner,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        description: skill.description || '',
        level: skill.level,
      });
    }
  }, [skill]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'level' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Python, Leadership"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Technical, Soft Skill"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Skill Level *
            </label>
            <select
              id="level"
              name="level"
              required
              value={formData.level}
              onChange={handleChange}
              className="input-field"
            >
              <option value={SkillLevel.Beginner}>Beginner</option>
              <option value={SkillLevel.Intermediate}>Intermediate</option>
              <option value={SkillLevel.Expert}>Expert</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Add any notes or details about this skill..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : skill ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;
