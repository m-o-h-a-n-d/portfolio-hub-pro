import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, Save, Upload, Image } from 'lucide-react';

const PortfolioManager = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'web design',
    description: '',
    link: '#',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/portfolio');
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({ title: '', category: 'web design', description: '', link: '#', image: '' });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode('edit');
    setEditingItem(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      link: project.link,
      image: project.image
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ title: '', category: 'web design', description: '', link: '#', image: '' });
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiPost('/portfolio', {
        ...formData,
        id: editingItem?.id || Date.now()
      });

      if (modalMode === 'add') {
        const newProject = { ...formData, id: Date.now() };
        setPortfolio(prev => ({
          ...prev,
          projects: [...(prev.projects || []), newProject]
        }));
      } else {
        setPortfolio(prev => ({
          ...prev,
          projects: prev.projects.map(p => 
            p.id === editingItem.id ? { ...p, ...formData } : p
          )
        }));
      }

      closeModal();
      alert(`Project ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setPortfolio(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id)
      }));
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

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
          <h1 className="h2 text-white-2">Portfolio Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <button onClick={openAddModal} className="form-btn !w-auto !px-6">
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio?.projects?.map((project) => (
          <div 
            key={project.id}
            className="bg-card border border-border rounded-[20px] overflow-hidden group"
            style={{ background: 'var(--bg-gradient-jet)' }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEditModal(project)}
                  className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-3 rounded-xl bg-destructive text-white-1 hover:bg-destructive/90 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-foreground font-medium mb-1">{project.title}</h3>
              <p className="text-vegas-gold text-sm capitalize">{project.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay active" onClick={closeModal}>
          <div className="admin-modal max-w-lg" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">
                {modalMode === 'add' ? 'Add Project' : 'Edit Project'}
              </h3>
              <button onClick={closeModal} className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Project Image</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                    {formData.image ? (
                      <div className="relative">
                        <img src={formData.image} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="absolute top-2 right-2 p-1 bg-destructive rounded-full text-white-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Image className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-sm">Click to upload image</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                </div>

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
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    {portfolio?.categories?.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input min-h-[80px] resize-y"
                  />
                </div>

                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Link</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl bg-onyx text-muted-foreground">
                  Cancel
                </button>
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

export default PortfolioManager;
