import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, Save, User, Star } from 'lucide-react';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    text: '',
    rating: 5
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/testimonials');
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({ name: '', avatar: '', text: '', rating: 5 });
    setModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    setModalMode('edit');
    setEditingItem(testimonial);
    setFormData({
      name: testimonial.name,
      avatar: testimonial.avatar,
      text: testimonial.text,
      rating: testimonial.rating || 5
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
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
        setTestimonials(prev => [...prev, submissionData]);
      } else {
        setTestimonials(prev => prev.map(t => t.id === editingItem.id ? submissionData : t));
      }

      closeModal();
      alert(`Testimonial ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Error saving testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      alert('Testimonial deleted successfully!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h2 text-white-2">Testimonials Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage client feedback and ratings</p>
        </div>
        <button onClick={openAddModal} className="form-btn !w-auto !px-6">
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="bg-card border border-border rounded-[20px] p-6 flex flex-col gap-4 relative group"
            style={{ background: 'var(--bg-gradient-jet)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-onyx border border-border flex items-center justify-center overflow-hidden">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-foreground font-medium">{testimonial.name}</h3>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < (testimonial.rating || 5) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm italic">"{testimonial.text}"</p>
            
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(testimonial)} className="p-2 rounded-lg bg-onyx text-primary hover:bg-primary/20">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(testimonial.id)} className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay active" onClick={closeModal}>
          <div className="admin-modal max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">{modalMode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={closeModal} className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-onyx border border-border flex items-center justify-center overflow-hidden relative group">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Plus className="w-6 h-6 text-white-1" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">Client Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
                  </div>
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">Rating</label>
                    <select name="rating" value={formData.rating} onChange={handleInputChange} className="form-input">
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Feedback</label>
                <textarea name="text" value={formData.text} onChange={handleInputChange} className="form-input min-h-[120px] resize-y" required />
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

export default TestimonialsManager;
