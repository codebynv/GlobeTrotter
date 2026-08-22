'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Shield, Bell, LogOut, Map, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.name) {
      setFullName(profile.name);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          email: user.email,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        setSaveError(error.message);
      } else {
        await refreshProfile();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveError('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (fullName || user?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AuthGuard>
      <PageContainer size="md">
        <PageHeader
          title="Account Profile"
          description="Manage your account preferences, personal info, and travel settings."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Profile' }]}
        />

        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}
            {saveError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white text-xl font-bold shadow-md">
                  {initials}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {fullName || user?.email?.split('@')[0] || 'Traveler'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email} • Explorer Member
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 dark:text-rose-400"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
                helperText="Email is managed through your auth account"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Travel Stats Card */}
          <Card className="p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-4">Travel Lifetime Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</p>
                <p className="text-xs text-slate-500 mt-1">Trips Planned</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">7</p>
                <p className="text-xs text-slate-500 mt-1">Cities Visited</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">26</p>
                <p className="text-xs text-slate-500 mt-1">Activities Logged</p>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </AuthGuard>
  );
}
