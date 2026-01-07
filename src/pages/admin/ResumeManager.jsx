import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, BookOpen, Briefcase, Award, Save } from 'lucide-react';

const ResumeManager = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('education');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startYear: new Date().getFullYear().toString(),
    endYear: new Date().getFullYear().toString(),
    isPresent: false,
    description: ''
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/resume');
      setResume(response.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
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
    
    // Parse period "2019 — 2022" or "2019 — Present"
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
    setFormData({ 
      title: '', 
      startYear: new Date().getFullYear().toString(),
      endYear: new Date().getFullYear().toString(),
      isPresent: false,
      description: '' 
    });
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
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const period = `${formData.startYear} — ${formData.isPresent ? 'Present' : formData.endYear}`;
      const submissionData = {
        title: formData.title,
        period,
        description: formData.description,
        id: editingItem?.id || Date.now()
      };

      await apiPost(endpoint, submissionData);

      // Optimistic update
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
      alert(`${activeTab === 'education' ? 'Education' : 'Experience'} ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // In real app, this would be an API call
      setResume(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting item');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h2 text-white-2">Resume Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your education and experience</p>
        </div>
        <button
          onClick={openAddModal}
          className="form-btn !w-auto !px-6"
        >
          <Plus className="w-5 h-5" />
          <span>Add New</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-[20px] p-2" style={{ background: 'var(--bg-gradient-jet)' }}>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 justify-center ${
              activeTab === 'education' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Education</span>
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 justify-center ${
              activeTab === 'experience' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Experience</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all flex-1 justify-center ${
              activeTab === 'skills' 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>Skills</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'skills' ? (
        /* Skills Section */
        <div className="bg-card border border-border rounded-[20px] p-6" style={{ background: 'var(--bg-gradient-jet)' }}>
          <h3 className="h3 text-white-2 mb-4">Skills</h3>
          <div className="space-y-4">
            {resume?.skills?.map((skill) => (
              <div key={skill.id} className="flex items-center gap-4">
                <input
                  type="text"
                  value={skill.name}
                  className="form-input flex-1"
                  readOnly
                />
                <input
                  type="number"
                  value={skill.percentage}
                  className="form-input w-24 text-center"
                  min="0"
                  max="100"
                  readOnly
                />
                <span className="text-muted-foreground">%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Education/Experience Table */
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
                    <td>
                      <span className="text-vegas-gold">{item.period}</span>
                    </td>
                    <td className="max-w-xs truncate">{item.description}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg bg-onyx text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!currentData || currentData.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-muted-foreground">
                      No {activeTab} entries found. Click "Add New" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div 
          className="admin-modal-overlay active"
          onClick={closeModal}
        >
          <div 
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">
                {modalMode === 'add' ? 'Add' : 'Edit'} {activeTab === 'education' ? 'Education' : 'Experience'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={activeTab === 'education' ? 'e.g., University of Arts' : 'e.g., Senior Developer'}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">Start Year</label>
                    <select
                      name="startYear"
                      value={formData.startYear}
                      onChange={handleInputChange}
                      className="form-input bg-onyx"
                      required
                    >
                      {Array.from({ length: 31 }, (_, i) => 2010 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">End Year</label>
                    <div className="flex flex-col gap-2">
                      <select
                        name="endYear"
                        value={formData.endYear}
                        onChange={handleInputChange}
                        className="form-input bg-onyx disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={formData.isPresent}
                        required={!formData.isPresent}
                      >
                        {Array.from({ length: 31 }, (_, i) => 2010 + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPresent"
                          checked={formData.isPresent}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-jet bg-onyx text-primary focus:ring-primary"
                        />
                        <span className="text-xs text-muted-foreground uppercase">Currently Working Here</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input min-h-[100px] resize-y"
                    placeholder="Enter description..."
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl bg-onyx text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-btn !w-auto flex-1"
                >
                  <Save className="w-5 h-5" />
                  <span>{modalMode === 'add' ? 'Add' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
