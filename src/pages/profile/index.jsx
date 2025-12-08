import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nutri_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/me/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          setError(text || 'Failed to load profile');
          return;
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError('An error occurred while loading your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
          <p className="text-muted-foreground mb-4">You haven\'t created a profile yet.</p>
          <Button onClick={() => navigate('/user-profile-creation')}>Create Profile</Button>
        </div>
      </div>
    );
  }

  const fullName = profile.full_name || profile.username || profile.email || 'User';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />
      <div
        className="fixed inset-0 opacity-30 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
        }}
      />

      <Header />
      <main className="pt-16">
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
          <Breadcrumb />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">Profile</h1>
            <p className="text-muted-foreground font-body">Review your personal details and preferences.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 lg:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Full Name</p>
                  <p>{fullName}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p>{profile.email}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Age</p>
                  <p>{profile.age ?? '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Gender</p>
                  <p>{profile.gender || '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Height</p>
                  <p>{profile.height_cm ? `${profile.height_cm} cm` : '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Current Weight</p>
                  <p>{profile.current_weight_kg ? `${profile.current_weight_kg} kg` : '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Target Weight</p>
                  <p>{profile.target_weight_kg ? `${profile.target_weight_kg} kg` : '—'}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Activity Level</p>
                  <p>{profile.activity_level || '—'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Health & Goals</h2>
              <p className="text-sm text-muted-foreground">
                {profile.health_goals || 'No goals set yet.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Dietary Preferences</h2>
              <pre className="text-xs bg-background/60 border border-border rounded-md p-3 text-muted-foreground overflow-auto">
                {profile.dietary_preferences
                  ? JSON.stringify(profile.dietary_preferences, null, 2)
                  : 'No dietary preferences saved yet.'}
              </pre>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Budget Settings</h2>
              <pre className="text-xs bg-background/60 border border-border rounded-md p-3 text-muted-foreground overflow-auto">
                {profile.budget_settings
                  ? JSON.stringify(profile.budget_settings, null, 2)
                  : 'No budget settings saved yet.'}
              </pre>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate('/user-profile-creation')}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
