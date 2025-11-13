import React from 'react';
import { Skill, SkillLevel } from '../types';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete }) => {
  const getLevelBadgeClass = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.Beginner:
        return 'badge badge-beginner';
      case SkillLevel.Intermediate:
        return 'badge badge-intermediate';
      case SkillLevel.Expert:
        return 'badge badge-expert';
      default:
        return 'badge';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{skill.name}</h3>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
            {skill.category}
          </span>
        </div>
        <span className={getLevelBadgeClass(skill.level)}>{skill.levelName}</span>
      </div>

      {skill.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{skill.description}</p>
      )}

      <div className="flex items-center text-xs text-gray-500 mb-4">
        <Calendar className="w-4 h-4 mr-1" />
        <span>Updated: {formatDate(skill.lastUpdated)}</span>
      </div>

      <div className="flex space-x-2 pt-3 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default SkillCard;
