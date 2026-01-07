import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/request';
import { 
  API_SKILLS_LIST, 
  API_SKILLS_CREATE, 
  API_SKILLS_UPDATE, 
  API_SKILLS_DELETE 
} from '../../api/endpoints';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../../hooks/use-toast";

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingSkill, setEditingSkill] = useState(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    percentage: 80
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await apiGet(API_SKILLS_LIST);
      setSkills(response.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingSkill(null);
    setFormData({ name: '', percentage: 80 });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setModalMode('edit');
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      percentage: skill.percentage
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const response = await apiPost(API_SKILLS_CREATE, formData);
        setSkills([...skills, response.data]);
        toast({ title: "Success", description: "Skill added successfully" });
      } else {
        const response = await apiPut(`${API_SKILLS_UPDATE}/${editingSkill.id}`, formData);
        setSkills(skills.map(s => s.id === editingSkill.id ? response.data : s));
        toast({ title: "Success", description: "Skill updated successfully" });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await apiDelete(`${API_SKILLS_DELETE}/${id}`);
      setSkills(skills.filter(s => s.id !== id));
      toast({ title: "Success", description: "Skill deleted successfully" });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
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
    <div className="bg-card border border-border rounded-[20px] overflow-hidden" style={{ background: 'var(--bg-gradient-jet)' }}>
      <div className="p-6 flex items-center justify-between border-b border-border">
        <h3 className="h3 text-white-2">Skills Management</h3>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th className="text-left px-6 py-4">Skill Name</th>
              <th className="text-left px-6 py-4">Proficiency</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-t border-border/50">
                <td className="px-6 py-4 font-medium text-foreground">{skill.name}</td>
                <td className="px-6 py-4 w-1/3">
                  <div className="flex items-center gap-3">
                    <Progress value={skill.percentage} className="h-2" />
                    <span className="text-sm text-vegas-gold min-w-[3rem]">{skill.percentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(skill)} 
                      className="p-2 rounded-lg bg-onyx text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(skill.id)} 
                      className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-8 text-muted-foreground">
                  No skills found. Click "Add Skill" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-onyx border-border text-white-2">
          <DialogHeader>
            <DialogTitle>{modalMode === 'add' ? 'Add New Skill' : 'Edit Skill'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. React, PHP, Teamwork"
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Proficiency</Label>
                <span className="text-sm text-vegas-gold">{formData.percentage}%</span>
              </div>
              <Slider
                value={[formData.percentage]}
                onValueChange={(val) => setFormData({ ...formData, percentage: val[0] })}
                max={100}
                step={1}
                className="py-4"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal} className="bg-transparent border-border hover:bg-onyx">
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                {modalMode === 'add' ? 'Create Skill' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsManager;
