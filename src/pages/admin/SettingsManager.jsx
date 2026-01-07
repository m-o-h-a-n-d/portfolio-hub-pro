import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Save, Globe, Share2, Upload } from 'lucide-react';

const SettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState({ logo: false, favicon: false });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // File Upload Logic
  const handleFileUpload = (type, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('site_identity', type === 'logo' ? 'logo_url' : 'favicon_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragFile = (e, type, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: active }));
  };

  const handleDropFile = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(type, e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await apiPost('/settings/update', settings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
    } finally {
      setSaving(false);
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
          <h1 className="h2 text-white-2">Global Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage site identity and social links</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="form-btn !w-auto !px-6"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Identity */}
        <div className="bg-card border border-border rounded-[20px] p-6 space-y-6" style={{ background: 'var(--bg-gradient-jet)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="h3 text-white-2">Site Identity</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-light-gray/70 text-xs uppercase mb-2 block">Admin Username</label>
              <input
                type="text"
                value={settings.site_identity.admin_username}
                onChange={(e) => handleInputChange('site_identity', 'admin_username', e.target.value)}
                className="form-input"
                placeholder="Enter admin name"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Logo</label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center min-h-[160px] ${
                    dragActive.logo ? 'border-primary bg-primary/5' : 'border-border bg-onyx/50'
                  }`}
                  onDragEnter={(e) => handleDragFile(e, 'logo', true)}
                  onDragLeave={(e) => handleDragFile(e, 'logo', false)}
                  onDragOver={(e) => handleDragFile(e, 'logo', true)}
                  onDrop={(e) => handleDropFile(e, 'logo')}
                >
                  {settings.site_identity.logo_url ? (
                    <div className="relative group w-full h-full flex items-center justify-center">
                      <img src={settings.site_identity.logo_url} alt="Logo" className="max-w-full max-h-24 object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <label className="cursor-pointer p-2 bg-primary rounded-full text-white-1 hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('logo', e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">
                        <span className="text-primary font-medium">Click to upload</span> or drag and drop
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('logo', e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Favicon Upload */}
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Favicon</label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center min-h-[160px] ${
                    dragActive.favicon ? 'border-primary bg-primary/5' : 'border-border bg-onyx/50'
                  }`}
                  onDragEnter={(e) => handleDragFile(e, 'favicon', true)}
                  onDragLeave={(e) => handleDragFile(e, 'favicon', false)}
                  onDragOver={(e) => handleDragFile(e, 'favicon', true)}
                  onDrop={(e) => handleDropFile(e, 'favicon')}
                >
                  {settings.site_identity.favicon_url ? (
                    <div className="relative group w-full h-full flex items-center justify-center">
                      <img src={settings.site_identity.favicon_url} alt="Favicon" className="w-12 h-12 object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <label className="cursor-pointer p-2 bg-primary rounded-full text-white-1 hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('favicon', e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">
                        <span className="text-primary font-medium">Click to upload</span> or drag and drop
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('favicon', e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-card border border-border rounded-[20px] p-6 space-y-6" style={{ background: 'var(--bg-gradient-jet)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="h3 text-white-2">Social Media Links</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.social_links).map(([platform, url]) => (
              <div key={platform}>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block capitalize">{platform}</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleInputChange('social_links', platform, e.target.value)}
                  className="form-input"
                  placeholder={`https://${platform}.com/yourprofile`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
