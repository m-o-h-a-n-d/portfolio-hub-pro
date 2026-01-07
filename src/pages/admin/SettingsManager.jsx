import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Save, Globe, Share2, Layout, Upload } from 'lucide-react';

const SettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleOrderChange = (id, newOrder) => {
    setSettings(prev => ({
      ...prev,
      layout_control: {
        ...prev.layout_control,
        resume_order: prev.layout_control.resume_order.map(item => 
          item.id === id ? { ...item, order: parseInt(newOrder) } : item
        ).sort((a, b) => a.order - b.order)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <p className="text-muted-foreground text-sm mt-1">Manage site identity, social links, and layout</p>
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Logo</label>
                <div className="flex flex-col gap-3">
                  <div className="w-16 h-16 rounded-lg bg-onyx border border-border flex items-center justify-center overflow-hidden">
                    <img src={settings.site_identity.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-onyx text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors border border-border">
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Favicon</label>
                <div className="flex flex-col gap-3">
                  <div className="w-16 h-16 rounded-lg bg-onyx border border-border flex items-center justify-center overflow-hidden">
                    <img src={settings.site_identity.favicon_url} alt="Favicon" className="w-8 h-8 object-contain" />
                  </div>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-onyx text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors border border-border">
                    <Upload className="w-4 h-4" />
                    <span>Upload Favicon</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
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

        {/* Layout Control */}
        <div className="bg-card border border-border rounded-[20px] p-6 space-y-6 lg:col-span-2" style={{ background: 'var(--bg-gradient-jet)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Layout className="w-5 h-5 text-primary" />
            <h3 className="h3 text-white-2">Layout Control (Section Ordering)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings.layout_control.resume_order.map((section) => (
              <div key={section.id} className="p-4 rounded-xl bg-onyx border border-border flex items-center justify-between">
                <span className="font-medium text-white-2">{section.label}</span>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground uppercase">Order:</label>
                  <input
                    type="number"
                    value={section.order}
                    onChange={(e) => handleOrderChange(section.id, e.target.value)}
                    className="w-16 bg-background border border-border rounded-lg px-2 py-1 text-center text-primary focus:border-primary outline-none"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">Sections will be displayed in the portfolio based on these order values.</p>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
