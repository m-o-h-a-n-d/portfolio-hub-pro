import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Link as LinkIcon, Search } from 'lucide-react';
import Swal from '../../lib/swal';

const ClientsManager = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    url: '#'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/clients');
      // Handle both { clients: [] } and [] formats
      const data = response.data.clients || response.data;
      const clientsList = Array.isArray(data) ? data : [];
      setClients(clientsList);
      setFilteredClients(clientsList);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setFormData({ name: '', logo: '', url: '#' });
    setModalOpen(true);
  };

  const openEditModal = (client) => {
    setModalMode('edit');
    setEditingItem(client);
    setFormData({
      name: client.name,
      logo: client.logo,
      url: client.url || '#'
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
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
      await apiPost('/clients', submissionData);

      if (modalMode === 'add') {
        setClients(prev => [...prev, submissionData]);
      } else {
        setClients(prev => prev.map(c => c.id === editingItem.id ? submissionData : c));
      }

      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Client ${modalMode === 'add' ? 'added' : 'updated'} successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error saving client:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving client',
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
      setClients(prev => prev.filter(c => c.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Client deleted successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error deleting client:', error);
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
          <h1 className="h2 text-white-2">Clients Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your client logos and links</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-input !pl-10 !py-2 !w-64"
            />
          </div>
          <button onClick={openAddModal} className="form-btn !w-auto !px-6">
            <Plus className="w-5 h-5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <div 
            key={client.id}
            className="bg-card border border-border rounded-[20px] p-6 flex flex-col items-center gap-4 group relative"
            style={{ background: 'var(--bg-gradient-jet)' }}
          >
            <div className="w-24 h-24 rounded-xl bg-onyx border border-border flex items-center justify-center overflow-hidden p-4">
              <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div className="text-center">
              <h3 className="text-foreground font-medium">{client.name}</h3>
              <a href={client.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center justify-center gap-1 mt-1">
                <LinkIcon className="w-3 h-3" />
                Visit Website
              </a>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(client)} className="p-2 rounded-lg bg-onyx text-primary hover:bg-primary/20">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(client.id)} className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay active" onClick={closeModal}>
          <div className="admin-modal max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="h3 text-white-2">{modalMode === 'add' ? 'Add Client' : 'Edit Client'}</h3>
              <button onClick={closeModal} className="p-2 rounded-lg bg-onyx text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Company Logo</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  {formData.logo ? (
                    <div className="relative">
                      <img src={formData.logo} alt="Preview" className="max-h-24 mx-auto rounded-lg" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, logo: '' }))} className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-white-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">Click to upload logo</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Company Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Website URL</label>
                <input type="url" name="url" value={formData.url} onChange={handleInputChange} className="form-input" placeholder="https://..." />
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

export default ClientsManager;
