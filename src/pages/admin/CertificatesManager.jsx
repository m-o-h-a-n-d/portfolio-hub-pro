import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, Save, Award, Search, ZoomIn } from 'lucide-react';
import Swal from '../../lib/swal';

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    text: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/testimonials');
      // Handle both { testimonials: [] } and [] formats
      const data = response.data.testimonials || response.data;
      const certificatesList = Array.isArray(data) ? data : [];
      setCertificates(certificatesList);
      setFilteredCertificates(certificatesList);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setPreviewImage(null);
    setFormData({ 
      name: '', 
      avatar: '', 
      text: '', 
      date: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const openEditModal = (certificate) => {
    setModalMode('edit');
    setEditingItem(certificate);
    setPreviewImage(certificate.avatar);
    setFormData({
      name: certificate.name,
      avatar: certificate.avatar,
      text: certificate.text,
      date: certificate.date || new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setPreviewImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = certificates.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.text && c.text.toLowerCase().includes(query))
    );
    setFilteredCertificates(filtered);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        id: editingItem?.id || Date.now()
      };
      await apiPost('/testimonials', submissionData);

      if (modalMode === 'add') {
        setCertificates(prev => [...prev, submissionData]);
      } else {
        setCertificates(prev => prev.map(c => c.id === editingItem.id ? submissionData : c));
      }

      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Certificate ${modalMode === 'add' ? 'added' : 'updated'} successfully!`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error saving certificate:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving certificate'
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
      setCertificates(prev => prev.filter(c => c.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Certificate deleted successfully!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting certificate:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error deleting certificate'
      });
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="h2 text-white-2">Certificates Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your certificates and achievements</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-input !pl-10 !py-2 !w-64"
            />
          </div>
          <button onClick={openAddModal} className="form-btn !w-auto !px-6">
            <Plus className="w-5 h-5" />
            <span>Add Certificate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <div 
            key={certificate.id}
            className="bg-card border border-border rounded-[20px] overflow-hidden relative group"
            style={{ background: 'var(--bg-gradient-jet)' }}
          >
            {/* Certificate Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-onyx">
              {certificate.avatar ? (
                <img 
                  src={certificate.avatar} 
                  alt={certificate.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-onyx">
                  <Award className="w-12 h-12 text-muted-foreground opacity-50" />
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button 
                  onClick={() => openEditModal(certificate)} 
                  className="bg-primary/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-primary"
                >
                  <Edit2 className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => handleDelete(certificate.id)} 
                  className="bg-destructive/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-destructive"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-4">
              <h3 className="text-foreground font-medium line-clamp-2">{certificate.name}</h3>
              <p className="text-muted-foreground text-xs mt-2">
                {new Date(certificate.date).toLocaleDateString('en-GB', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
          <p className="text-muted-foreground">No certificates found. Add your first certificate!</p>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay active" onClick={closeModal}>
          <div className="admin-modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">{modalMode === 'add' ? 'Add Certificate' : 'Edit Certificate'}</h3>
              <button onClick={closeModal} className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Preview */}
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-3 block">Certificate Image</label>
                <div className="relative w-full aspect-[4/3] rounded-xl bg-onyx border border-border overflow-hidden group">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ZoomIn className="w-12 h-12 text-muted-foreground opacity-30" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Plus className="w-8 h-8 text-white-1" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Certificate Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="e.g., AWS Certified Solutions Architect"
                    required 
                  />
                </div>
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Date Obtained</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    required 
                  />
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Description (Optional)</label>
                <textarea 
                  name="text" 
                  value={formData.text} 
                  onChange={handleInputChange} 
                  className="form-input min-h-[100px] resize-y" 
                  placeholder="Add any notes or details about this certificate..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 rounded-xl bg-onyx text-muted-foreground hover:bg-onyx/80 transition-colors">Cancel</button>
                <button type="submit" className="form-btn !w-auto flex-1">
                  <Save className="w-5 h-5" />
                  <span>{modalMode === 'add' ? 'Add Certificate' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesManager;
