import React, { useState, useEffect } from 'react';
import { skillsApi } from '../services/api';
import { Skill, CreateSkillDto, SkillLevel, SkillSummary } from '../types';
import { Plus, Edit2, Trash2, BarChart3, Mail, Send } from 'lucide-react';
import SkillModal from '../components/SkillModal';
import SkillCard from '../components/SkillCard';

const Dashboard: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [summary, setSummary] = useState<SkillSummary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'category' | 'level'>('all');
  const [filterValue, setFilterValue] = useState('');

  // Email Report State
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [skillsData, summaryData] = await Promise.all([
        skillsApi.getAllSkills(),
        skillsApi.getSkillSummary(),
      ]);
      setSkills(skillsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSkill = async (data: CreateSkillDto) => {
    try {
      await skillsApi.createSkill(data);
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating skill:', error);
      alert('Failed to create skill');
    }
  };

  const handleUpdateSkill = async (id: number, data: CreateSkillDto) => {
    try {
      await skillsApi.updateSkill(id, data);
      await loadData();
      setIsModalOpen(false);
      setEditingSkill(null);
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Failed to update skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      await skillsApi.deleteSkill(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  // Handle Send Email Report
  const handleSendEmailReport = async () => {
    if (skills.length === 0) {
      setEmailMessage({
        type: 'error',
        text: 'You need to have at least one skill to send a report',
      });
      return;
    }

    setIsSendingEmail(true);
    setEmailMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/Skills/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmailMessage({
          type: 'success',
          text: data.message || 'Skills report sent successfully! Check your email.',
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setEmailMessage({ type: '', text: '' });
        }, 5000);
      } else {
        const errorText = await response.text();
        setEmailMessage({
          type: 'error',
          text: errorText || 'Failed to send email report',
        });
      }
    } catch (error) {
      setEmailMessage({
        type: 'error',
        text: 'Failed to connect to server. Please try again.',
      });
      console.error('Error sending email report:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const getFilteredSkills = () => {
    if (filter === 'all' || !filterValue) {
      return skills;
    }
    if (filter === 'category') {
      return skills.filter((s) => s.category === filterValue);
    }
    if (filter === 'level') {
      return skills.filter((s) => s.level.toString() === filterValue);
    }
    return skills;
  };

  const filteredSkills = getFilteredSkills();
  const categories = summary ? Object.keys(summary.byCategory) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSendEmailReport}
            disabled={isSendingEmail || skills.length === 0}
            className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            title={skills.length === 0 ? 'Add skills first to send report' : 'Send skills report to your email'}
          >
            {isSendingEmail ? (
              <>
                <Send className="w-5 h-5 mr-2 animate-pulse" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Email Report
              </>
            )}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Email Status Message */}
      {emailMessage.text && (
        <div
          className={`p-4 rounded-lg border ${emailMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
            }`}
        >
          <div className="flex items-start">
            <Mail className={`w-5 h-5 mr-2 mt-0.5 ${emailMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`} />
            <div className="flex-1">
              <p className="font-medium">
                {emailMessage.type === 'success' ? 'Success!' : 'Error'}
              </p>
              <p className="text-sm mt-1">{emailMessage.text}</p>
            </div>
            <button
              onClick={() => setEmailMessage({ type: '', text: '' })}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Skills</p>
                <p className="text-3xl font-bold text-primary-600">{summary.totalSkills}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-primary-200" />
            </div>
          </div>

          <div className="card">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">By Level</p>
              <div className="space-y-1">
                {Object.entries(summary.byLevel).map(([level, count]) => (
                  <div key={level} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {level === '1' ? 'Beginner' : level === '2' ? 'Intermediate' : 'Expert'}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Top Categories</p>
              <div className="space-y-1">
                {Object.entries(summary.byCategory)
                  .slice(0, 3)
                  .map(([category, count]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by</label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as 'all' | 'category' | 'level');
                setFilterValue('');
              }}
              className="input-field"
            >
              <option value="all">All Skills</option>
              <option value="category">Category</option>
              <option value="level">Level</option>
            </select>
          </div>

          {filter === 'category' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="input-field"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filter === 'level' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="input-field"
              >
                <option value="">Select level</option>
                <option value="1">Beginner</option>
                <option value="2">Intermediate</option>
                <option value="3">Expert</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No skills found. Start by adding your first skill!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() => openEditModal(skill)}
              onDelete={() => handleDeleteSkill(skill.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <SkillModal
          skill={editingSkill}
          onClose={closeModal}
          onSave={editingSkill ? (data) => handleUpdateSkill(editingSkill.id, data) : handleCreateSkill}
        />
      )}
    </div>
  );
};

export default Dashboard;