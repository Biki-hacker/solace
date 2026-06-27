/**
 * Settings Page — Profile, exam settings, preferences, and account management.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import Modal from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { signOut, deleteAccount } from '../services/auth.service';
import { deleteUserData, updateUser } from '../services/firestore.service';
import { EXAM_TYPES, ROUTES } from '../utils/constants';
import { LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [examType, setExamType] = useState(profile?.examType || '');
  const [targetYear, setTargetYear] = useState(profile?.targetYear || new Date().getFullYear() + 1);
  const [showReminder, setShowReminder] = useState(true);
  const [showWellness, setShowWellness] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ displayName });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExam = async () => {
    setSaving(true);
    try {
      await updateProfile({ examType, targetYear: parseInt(targetYear) });
      toast.success('Exam settings updated');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate(ROUTES.LANDING);
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      await deleteUserData(user.uid);
      await deleteAccount();
      navigate(ROUTES.LANDING);
      toast.success('Account deleted');
    } catch (err) {
      toast.error('Failed to delete account. You may need to re-authenticate.');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const initials = (profile?.displayName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppShell>
      <PageWrapper title="Settings">
        {/* Profile */}
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-pearl mb-4">Profile</h3>
          <div className="flex items-center gap-4 mb-4">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-lavender-500/20 flex items-center justify-center text-sm font-bold text-lavender-400">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>
          <p className="text-xs text-pearl/30 mb-3">{user?.email}</p>
          <Button onClick={handleSaveProfile} loading={saving} size="sm">
            Save
          </Button>
        </Card>

        {/* Exam Settings */}
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-pearl mb-4">Exam Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-pearl/50 mb-1 block">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-pearl focus:outline-none focus:border-lavender-500/30"
              >
                <option value="" disabled>Select exam</option>
                {EXAM_TYPES.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-navy-800">
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Target Year"
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 5}
            />
            <Button onClick={handleSaveExam} loading={saving} size="sm">
              Save
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-pearl mb-4">Preferences</h3>
          <div className="space-y-4">
            <Toggle
              label="Daily check-in reminder"
              description="Get a gentle reminder to log your mood"
              checked={showReminder}
              onChange={setShowReminder}
            />
            <Toggle
              label="Show wellness score on dashboard"
              description="Display your weekly wellness score prominently"
              checked={showWellness}
              onChange={setShowWellness}
            />
          </div>
        </Card>

        {/* Account */}
        <Card>
          <h3 className="text-sm font-semibold text-pearl mb-4">Account</h3>
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              icon={<LogOut size={16} />}
              fullWidth
            >
              Sign Out
            </Button>
            <Button
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
              icon={<Trash2 size={16} />}
              fullWidth
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Account"
        >
          <p className="text-sm text-pearl/70 mb-4">
            Are you sure? This will permanently delete all your journals, mood logs,
            and conversations. Type <span className="font-mono text-rose-mood">DELETE</span> to confirm.
          </p>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="mb-4"
          />
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE'}
              loading={deleting}
              className="flex-1"
            >
              Delete Permanently
            </Button>
          </div>
        </Modal>
      </PageWrapper>
    </AppShell>
  );
}
