import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, BookOpen, Briefcase, Award, Save, GripVertical } from 'lucide-react';
import SkillsManager from '../../components/admin/SkillsManager';

const ResumeManager = () => {
  const [resume, setResume] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [activeTab, setActiveTab] = useState('education');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [draggedTabIndex, setDraggedTabIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    startYear: new Date().getFullYear().toString(),
    endYear: new Date().getFullYear().toString(),
    isPresent: false,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/resume');
      setResume(response.data || []);
      
      // Set first tab as active if available
      if (response.data && response.data.length > 0) {
        setActiveTab(response.data[0].type);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop for Tabs (Spatial Ordering)
  const onDragStart = (e, index) => {
    setDraggedTabIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedTabIndex === null || draggedTabIndex === index) return;

    const newResume = [...resume];
    const draggedItem = newResume[draggedTabIndex];
    
    newResume.splice(draggedTabIndex, 1);
    newResume.splice(index, 0, draggedItem);

    setDraggedTabIndex(index);
    setResume(newResume);
  };

  const onDragEnd = async () => {
    setDraggedTabIndex(null);
    try {
      setReordering(true);
      await apiPost('/resume/update', resume);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to save new order');
    } finally {
      setTimeout(() => setReordering(false), 500);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({ 
      title: '', 
      startYear: new Date().getFullYear().toString(),
      endYear: new Date().getFullYear().toString(),
      isPresent: false,
      description: '' 
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingItem(item);
    
    const parts = item.period.split(' — ');
    const startYear = parts[0] || new Date().getFullYear().toString();
    const endPart = parts[1] || '';
    const isPresent = endPart === 'Present';
    const endYear = isPresent ? new Date().getFullYear().toString() : endPart;

    setFormData({
      title: item.title,
      startYear,
      endYear,
      isPresent,
      description: item.description
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const period = `${formData.startYear} — ${formData.isPresent ? 'Present' : formData.endYear}`;
      const submissionData = {
        title: formData.title,
        period,
        description: formData.description,
        id: editingItem?.id || Date.now().toString()
      };

      const updatedResume = resume.map(section => {
        if (section.type === activeTab) {
          if (modalMode === 'add') {
            return { ...section, data: [...(section.data || []), submissionData] };
          } else {
            return { 
              ...section, 
              data: section.data.map(item => item.id === editingItem.id ? submissionData : item) 
            };
          }
        }
        return section;
      });

      await apiPost('/resume/update', updatedResume);
      setResume(updatedResume);
      closeModal();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const updatedResume = resume.map(section => {
        if (section.type === activeTab) {
          return { ...section, data: section.data.filter(item => item.id !== id) };
        }
        return section;
      });
      await apiPost('/resume/update', updatedResume);
      setResume(updatedResume);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'education': return BookOpen;
      case 'experince': return Briefcase;
      case 'skills': return Award;
      default: return BookOpen;
    }
  };

  const currentSection = resume.find(s => s.type === activeTab);
  const currentData = currentSection?.data || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {reordering && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-2xl">
          <div className="bg-onyx border border-border px-4 py-2 rounded-full shadow-xl flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-white-2">Updating order...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="h2 text-white-2">Resume Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your education, experience and skills in the order they appear</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[20px] p-2" style={{ background: 'var(--bg-gradient-jet)' }}>
        <div className="flex gap-2">
          {resume.map((section, index) => {
            const Icon = getIcon(section.type);
            const isActive = activeTab === section.type;
            const isDragged = draggedTabIndex === index;

            return (
              <div
                key={section.type}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                onClick={() => setActiveTab(section.type)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all cursor-pointer group relative ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-onyx/50'
                } ${isDragged ? 'opacity-40 scale-95' : ''}`}
              >
                <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-40 absolute left-2 cursor-grab active:cursor-grabbing" />
                <Icon className="w-5 h-5" />
                <span className="font-medium capitalize">{section.type === 'experince' ? 'Experience' : section.type}</span>
              </div>
            );
          })}
        </div>
      </div>

      {activeTab === 'skills' ? (
        <SkillsManager 
          skills={currentData} 
          onUpdate={async (newSkills) => {
            const updatedResume = resume.map(s => s.type === 'skills' ? { ...s, data: newSkills } : s);
            await apiPost('/resume/update', updatedResume);
            setResume(updatedResume);
          }} 
        />
      ) : (
        <div className="bg-card border border-border rounded-[20px] overflow-hidden" style={{ background: 'var(--bg-gradient-jet)' }}>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Period</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-foreground">{item.title}</td>
                    <td><span className="text-vegas-gold">{item.period}</span></td>
                    <td className="max-w-xs truncate">{item.description}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(item)} className="p-2 rounded-lg bg-onyx text-primary hover:bg-primary/20 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr><td colSpan="4" className="text-center py-8 text-muted-foreground">No {activeTab} entries found.</td></tr>
                )}
                <tr className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={openAddModal}>
                  <td colSpan="4" className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-primary font-medium">
                      <Plus className="w-5 h-5" />
                      <span>Add New {activeTab === 'education' ? 'Education' : 'Experience'}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay active" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">{modalMode === 'add' ? 'Add' : 'Edit'} {activeTab}</h3>
              <button onClick={closeModal} className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Start Year</label>
                  <input type="text" name="startYear" value={formData.startYear} onChange={handleInputChange} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">End Year</label>
                  <input type="text" name="endYear" value={formData.endYear} onChange={handleInputChange} className="form-input" disabled={formData.isPresent} required={!formData.isPresent} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isPresent" checked={formData.isPresent} onChange={handleInputChange} className="w-4 h-4 rounded border-jet bg-onyx text-primary" />
                <label className="text-sm text-light-gray">I am currently working/studying here</label>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input min-h-[100px]" required />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="form-btn !bg-onyx !w-auto !px-6">Cancel</button>
                <button type="submit" className="form-btn !w-auto !px-6">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
