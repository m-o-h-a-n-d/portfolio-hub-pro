import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/blog');
      // Handle both { posts: [] } and [] formats
      const data = response.data.posts || response.data;
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setModalMode('edit');
    setEditingItem(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      image: blog.image,
      date: blog.date
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
        setFormData(prev => ({ ...prev, image: reader.result }));
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
      await apiPost('/blog', submissionData);

      if (modalMode === 'add') {
        setBlogs(prev => [...prev, submissionData]);
      } else {
        setBlogs(prev => prev.map(b => b.id === editingItem.id ? submissionData : b));
      }

      closeModal();
      alert(`Blog ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      setBlogs(prev => prev.filter(b => b.id !== id));
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
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
          <h1 className="h2 text-white-2">Blogs Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your blog posts</p>
        </div>
        <button onClick={openAddModal} className="form-btn !w-auto !px-6">
          <Plus className="w-5 h-5" />
          <span>Add Blog</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-[20px] overflow-hidden" style={{ background: 'var(--bg-gradient-jet)' }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>
                    <img src={blog.image} alt={blog.title} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="font-medium text-foreground">{blog.title}</td>
                  <td><span className="text-vegas-gold">{blog.category}</span></td>
                  <td>{blog.date}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(blog)} className="p-2 rounded-lg bg-onyx text-primary hover:bg-primary/20">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay active" onClick={closeModal}>
          <div className="admin-modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">{modalMode === 'add' ? 'Add Blog' : 'Edit Blog'}</h3>
              <button onClick={closeModal} className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" required />
                  </div>
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="form-input" required />
                  </div>
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="form-input" required />
                  </div>
                </div>
                <div>
                  <label className="text-light-gray/70 text-xs uppercase mb-2 block">Thumbnail</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center h-[calc(100%-28px)] flex flex-col justify-center">
                    {formData.image ? (
                      <div className="relative">
                        <img src={formData.image} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-white-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-xs">Click to upload</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Content</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} className="form-input min-h-[150px] resize-y" required />
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

export default BlogsManager;
