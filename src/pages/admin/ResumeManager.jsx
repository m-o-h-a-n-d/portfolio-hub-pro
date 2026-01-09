import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, Save, GripVertical, Search } from 'lucide-react';
import Swal from '../../lib/swal';
import SkillsManager from '../../components/admin/SkillsManager';
import Pagination from '../../components/admin/Pagination';

const ResumeManager = () => {
  const [sectionsData, setSectionsData] = useState({
    education: [],
    experience: [],
    skills: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('education');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    title: '',
    period: '',
    description: ''
  });

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/resume');
      setSectionsData({
        education: response.data.education || [],
        experience: response.data.experience || [],
        skills: response.data.skills || []
      });
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({ title: '', period: '', description: '' });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditingItem(item);
    setFormData({
      title: item.title,
      period: item.period,
      description: item.description
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        id: editingItem?.id || Date.now()
      };

      await apiPost(`/resume/${activeTab}`, submissionData);

      if (modalMode === 'add') {
        setSectionsData(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], submissionData]
        }));
      } else {
        setSectionsData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(item => item.id === editingItem.id ? submissionData : item)
        }));
      }

      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} updated successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error saving resume item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving resume item',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (!result.isConfirmed) return;

    try {
      setSectionsData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Item deleted successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error deleting resume item:', error);
    }
  };

  const filteredData = (sectionsData[activeTab] || []).filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="h2 text-white-2">Resume Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your education, experience and skills</p>
        </div>
        {activeTab !== 'skills' && (
          <button onClick={openAddModal} className="form-btn !w-auto !px-6">
            <Plus className="w-5 h-5" />
            <span>Add {activeTab === 'education' ? 'Education' : 'Experience'}</span>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="bg-onyx/30 p-1 rounded-2xl border border-border flex w-full lg:w-auto">
          {['education', 'experience', 'skills'].map((type) => {
            const isActive = activeTab === type;
            return (
              <button
                key={type}
                onClick={() => handleTabChange(type)}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-xl transition-all capitalize font-medium ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-onyx/50'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
        
        {activeTab !== 'skills' && (
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={handleSearch}
              className="form-input !pl-10 !py-2 w-full"
            />
          </div>
        )}
      </div>

      {activeTab === 'skills' ? (
        <SkillsManager 
          skills={sectionsData.skills} 
          onUpdate={(newSkills) => {
            setSectionsData(prev => ({ ...prev, skills: newSkills }));
          }} 
        />
      ) : (
        <div className="space-y-4">
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
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-muted-foreground">No items found</td>
                    </tr>
                  ) : (
                    currentData.map((item) => (
                      <tr key={item.id}>
                        <td className="font-medium text-foreground">{item.title}</td>
                        <td><span className="text-vegas-gold">{item.period}</span></td>
                        <td className="max-w-xs truncate">{item.description}</td>
                        <td>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditModal(item)} className="p-2 rounded-lg bg-onyx text-primary hover:bg-primary/20">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}
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
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  required 
                />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Period</label>
                <input 
                  type="text" 
                  name="period" 
                  value={formData.period} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  placeholder="e.g. 2020 — Present"
                  required 
                />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="form-input min-h-[120px] resize-y" 
                  required 
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl bg-onyx text-muted-foreground">Cancel</button>
                <button type="submit" className="form-btn !w-auto flex-1">
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
