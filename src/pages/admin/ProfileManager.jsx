import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Save, Upload, User, Share2 } from 'lucide-react';

const ProfileManager = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleAboutChange = (index, value) => {
    setProfile(prev => {
      const newAbout = [...prev.about];
      newAbout[index] = value;
      return { ...prev, about: newAbout };
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiPost('/profile/update', profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h2 text-white-2">Profile Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Update your personal information and social links</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-[20px] p-6" style={{ background: 'var(--bg-gradient-jet)' }}>
            <h3 className="h3 text-white-2 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile?.name || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={profile?.title || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile?.email || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile?.phone || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={profile?.birthday || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile?.location || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-card border border-border rounded-[20px] p-6" style={{ background: 'var(--bg-gradient-jet)' }}>
            <h3 className="h3 text-white-2 mb-4">About Me</h3>
            {profile?.about?.map((paragraph, index) => (
              <div key={index} className="mb-4">
                <label className="text-light-gray/70 text-xs uppercase mb-2 block">Paragraph {index + 1}</label>
                <textarea
                  value={paragraph}
                  onChange={(e) => handleAboutChange(index, e.target.value)}
                  className="form-input min-h-[100px] resize-y"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-card border border-border rounded-[20px] p-6" style={{ background: 'var(--bg-gradient-jet)' }}>
            <h3 className="h3 text-white-2 mb-4">Profile Photo</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-[20px] object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-[20px] bg-onyx flex items-center justify-center border-2 border-border">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <label className="form-btn !w-full cursor-pointer inline-flex">
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-card border border-border rounded-[20px] p-6 space-y-4" style={{ background: 'var(--bg-gradient-jet)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-5 h-5 text-primary" />
              <h3 className="h3 text-white-2">Social Media</h3>
            </div>
            
            <div className="space-y-4">
              {profile.social_links && Object.entries(profile.social_links).map(([platform, url]) => (
                <div key={platform}>
                  <label className="text-light-gray/70 text-[10px] uppercase mb-1 block capitalize">{platform}</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleSocialChange(platform, e.target.value)}
                    className="form-input text-sm py-2"
                    placeholder={`https://${platform}.com/yourprofile`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
