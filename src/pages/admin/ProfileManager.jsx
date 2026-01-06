import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../api/request';
import { Save, Upload, User } from 'lucide-react';

const ProfileManager = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState(null);
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

  const handleAboutChange = (index, value) => {
    setProfile(prev => {
      const newAbout = [...prev.about];
      newAbout[index] = value;
      return { ...prev, about: newAbout };
    });
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
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
      // In a real app, you'd use FormData for file uploads
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        if (key === 'about') {
          formData.append(key, JSON.stringify(profile[key]));
        } else if (key === 'social') {
          formData.append(key, JSON.stringify(profile[key]));
        } else {
          formData.append(key, profile[key]);
        }
      });

      if (cvFile) {
        formData.append('cv', cvFile);
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="h2 text-white-2">Profile Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-card border border-border rounded-[20px] p-6" style={{ background: 'var(--bg-gradient-jet)' }}>
          <h3 className="h3 text-white-2 mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-[20px] object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-[20px] bg-onyx flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <label className="form-btn !w-auto cursor-pointer inline-flex">
                <Upload className="w-5 h-5" />
                <span>Upload Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                />
              </label>
              <p className="text-muted-foreground text-xs mt-2">JPG, PNG. Max 2MB.</p>
            </div>
          </div>
        </div>

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

        {/* CV Upload */}
        <div className="bg-card border border-border rounded-[20px] p-6" style={{ background: 'var(--bg-gradient-jet)' }}>
          <h3 className="h3 text-white-2 mb-4">CV / Resume File</h3>
          <div className="flex items-center gap-4">
            <label className="form-btn !w-auto cursor-pointer inline-flex">
              <Upload className="w-5 h-5" />
              <span>Upload CV (PDF)</span>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleCvUpload}
              />
            </label>
            {cvFile && (
              <span className="text-primary text-sm">{cvFile.name}</span>
            )}
            {!cvFile && profile?.cv_url && (
              <span className="text-muted-foreground text-sm">Current: {profile.cv_url}</span>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="form-btn"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
};

export default ProfileManager;
