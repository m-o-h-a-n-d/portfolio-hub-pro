import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/request';
import { 
  API_BLOG_LIST, 
  API_BLOG_CREATE, 
  API_BLOG_UPDATE, 
  API_BLOG_DELETE 
} from '../../api/endpoints';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Search } from 'lucide-react';
import Swal from '../../lib/swal';
import Pagination from '../../components/admin/Pagination';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
    link: '',
    date: new Date().toISOString().split('T')[0]
  });

  const itemsPerPage = 5;

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [searchQuery, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiGet(API_BLOG_LIST);
      const data = response.data.posts || response.data;
      const blogsData = Array.isArray(data) ? data : [];
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      content: '',
      image: '',
      link: '',
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
      link: blog.link || '',
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
      
      if (modalMode === 'add') {
        await apiPost(API_BLOG_CREATE, submissionData);
        setBlogs(prev => [...prev, submissionData]);
      } else {
        await apiPut(`${API_BLOG_UPDATE}/${editingItem.id}`, submissionData);
        setBlogs(prev => prev.map(b => b.id === editingItem.id ? submissionData : b));
      }

      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Blog ${modalMode === 'add' ? 'added' : 'updated'} successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error saving blog:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving blog',
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
      await apiDelete(`${API_BLOG_DELETE}/${id}`);
      setBlogs(prev => prev.filter(b => b.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Blog deleted successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // Client-side pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

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
          <h1 className="h2 text-white-2">Blogs Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your blog posts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-input !pl-10 !py-2 !w-64"
            />
          </div>
          <button onClick={openAddModal} className="form-btn !w-auto !px-6">
            <Plus className="w-5 h-5" />
            <span>Add Blog</span>
          </button>
        </div>
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
              {currentItems.map((blog) => (
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
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted-foreground">
                    No blogs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
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
                  <div>
                    <label className="text-light-gray/70 text-xs uppercase mb-2 block">External Link</label>
                    <input type="url" name="link" value={formData.link} onChange={handleInputChange} className="form-input" placeholder="https://..." />
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
