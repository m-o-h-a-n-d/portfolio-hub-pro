import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, BookOpen, Briefcase, Award, Save, GripVertical } from 'lucide-react';
import SkillsManager from '../../components/admin/SkillsManager';

const ResumeManager = () => {
  const [resume, setResume] = useState(null);
  const [settings, setSettings] = useState(null);
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
      const [resumeRes, settingsRes] = await Promise.all([
        apiGet('/resume'),
        apiGet('/settings')
      ]);
      setResume(resumeRes.data);
      
      // Sort tabs by order
      const settingsData = settingsRes.data;
      if (settingsData.layout_control?.resume_order) {
        settingsData.layout_control.resume_order.sort((a, b) => a.order - b.order);
      }
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop for Tabs
  const onDragStart = (e, index) => {
    setDraggedTabIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedTabIndex === null || draggedTabIndex === index) return;

    const newOrder = [...settings.layout_control.resume_order];
    const draggedItem = newOrder[draggedTabIndex];
    
    newOrder.splice(draggedTabIndex, 1);
    newOrder.splice(index, 0, draggedItem);

    const updatedOrder = newOrder.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setDraggedTabIndex(index);
    setSettings(prev => ({
      ...prev,
      layout_control: {
        ...prev.layout_control,
        resume_order: updatedOrder
      }
    }));
  };

  const onDragEnd = async () => {
    setDraggedTabIndex(null);
    try {
      setReordering(true);
      await apiPost('/settings/update', settings);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to save new order');
    } finally {
      // Small delay to show loading state as requested
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
      const endpoint = activeTab === 'education' ? '/resume/education' : '/resume/experience';
      const period = `${formData.startYear} — ${formData.isPresent ? 'Present' : formData.endYear}`;
      const submissionData = {
        title: formData.title,
        period,
        description: formData.description,
        id: editingItem?.id || Date.now()
      };

      await apiPost(endpoint, submissionData);

      if (modalMode === 'add') {
        setResume(prev => ({
          ...prev,
          [activeTab]: [...(prev[activeTab] || []), submissionData]
        }));
      } else {
        setResume(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(item => 
            item.id === editingItem.id ? submissionData : item
          )
        }));
      }

      closeModal();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      setResume(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const getIcon = (id) => {
    switch(id) {
      case 'education': return BookOpen;
      case 'experience': return Briefcase;
      case 'skills': return Award;
      default: return BookOpen;
    }
  };

  const currentData = activeTab === 'education' ? resume?.education : resume?.experience;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay for Reordering */}
      {reordering && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-2xl">
          <div className="bg-onyx border border-border px-4 py-2 rounded-full shadow-xl flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-white-2">Updating order...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h2 text-white-2">Resume Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your education and experience</p>
        </div>
      </div>

      {/* Draggable Tabs */}
      <div className="bg-card border border-border rounded-[20px] p-2" style={{ background: 'var(--bg-gradient-jet)' }}>
        <div className="flex gap-2">
          {settings?.layout_control?.resume_order.map((section, index) => {
            const Icon = getIcon(section.id);
            const isActive = activeTab === section.id;
            const isDragged = draggedTabIndex === index;

            return (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                onClick={() => setActiveTab(section.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all cursor-pointer group relative ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-onyx/50'
                } ${isDragged ? 'opacity-40 scale-95' : ''}`}
              >
                <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-40 absolute left-2 cursor-grab active:cursor-grabbing" />
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'skills' ? (
        <SkillsManager />
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
                {currentData?.map((item) => (
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
                {(!currentData || currentData.length === 0) && (
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

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay active" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">{modalMode === 'add' ? 'Add' : 'Edit'} {activeTab}</h3>
              <button onClick={closeModal} className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">Start Year</label>
                    <select name="startYear" value={formData.startYear} onChange={handleInputChange} className="form-input bg-onyx" required>
                      {Array.from({ length: 31 }, (_, i) => 2010 + i).map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">End Year</label>
                    <div className="flex flex-col gap-2">
                      <select name="endYear" value={formData.endYear} onChange={handleInputChange} className="form-input bg-onyx disabled:opacity-50" disabled={formData.isPresent} required={!formData.isPresent}>
                        {Array.from({ length: 31 }, (_, i) => 2010 + i).map(year => <option key={year} value={year}>{year}</option>)}
                      </select>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="isPresent" checked={formData.isPresent} onChange={handleInputChange} className="w-4 h-4 rounded border-jet bg-onyx text-primary" />
                        <span className="text-xs text-muted-foreground uppercase">Currently Working Here</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input min-h-[100px] resize-y" required />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl bg-onyx text-muted-foreground">Cancel</button>
                <button type="submit" className="form-btn !w-auto flex-1"><Save className="w-5 h-5" /><span>{modalMode === 'add' ? 'Add' : 'Save'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
