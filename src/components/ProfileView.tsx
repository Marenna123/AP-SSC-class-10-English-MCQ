import React, { useState } from 'react';
import { User, Award, CheckCircle2, ShieldCheck, Database, RefreshCw, Edit2, Save, ExternalLink } from 'lucide-react';
import { StudentProfile } from '../types';
import { OverallStats } from '../lib/storage';
import { getSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';

interface ProfileViewProps {
  profile: StudentProfile;
  stats: OverallStats;
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onOpenAdmin: () => void;
  onResetProgress: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  stats,
  onUpdateProfile,
  onOpenAdmin,
  onResetProgress,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editSchool, setEditSchool] = useState(profile.school || '');

  // Supabase connection state
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [showDbModal, setShowDbModal] = useState(false);
  const [dbUrl, setDbUrl] = useState(supabaseConfig.url);
  const [dbKey, setDbKey] = useState(supabaseConfig.anonKey);
  const [dbSavedMessage, setDbSavedMessage] = useState('');

  const handleSaveProfile = () => {
    if (editName.trim()) {
      onUpdateProfile({ name: editName.trim(), school: editSchool.trim() });
      setIsEditing(false);
    }
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSupabaseConfig({ url: dbUrl, anonKey: dbKey });
    setSupabaseConfig(updated);
    setDbSavedMessage('Supabase settings updated successfully!');
    setTimeout(() => setDbSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto">
      {/* Student Identity Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-xl font-['Outfit',sans-serif] shadow-xs shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-sm font-bold border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Student Name"
                  />
                  <input
                    type="text"
                    value={editSchool}
                    onChange={(e) => setEditSchool(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 block w-full"
                    placeholder="School / Location"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                    {profile.name}
                  </h2>
                  <p className="text-xs text-indigo-700 font-bold">
                    {profile.grade}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {profile.school || 'Andhra Pradesh Board of Secondary Education'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            id="profile-edit-btn"
            onClick={() => {
              if (isEditing) handleSaveProfile();
              else setIsEditing(true);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            title={isEditing ? 'Save Profile' : 'Edit Name'}
          >
            {isEditing ? <Save className="w-5 h-5 text-indigo-600" /> : <Edit2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Section 14: Clean, Direct Metrics */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Questions Attempted
            </span>
            <span className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
              {stats.questionsAttempted}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Questions Correct
            </span>
            <span className="text-lg font-black text-emerald-600 font-['Outfit',sans-serif]">
              {stats.correctAnswers}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Overall Accuracy
            </span>
            <span className="text-lg font-black text-indigo-600 font-['Outfit',sans-serif]">
              {stats.accuracy}%
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Lessons Completed
            </span>
            <span className="text-lg font-black text-blue-600 font-['Outfit',sans-serif]">
              {stats.lessonsCompleted} / 8
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Poems Completed
            </span>
            <span className="text-lg font-black text-violet-600 font-['Outfit',sans-serif]">
              {stats.poemsCompleted} / 8
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tests Completed
            </span>
            <span className="text-lg font-black text-amber-600 font-['Outfit',sans-serif]">
              {stats.testsCompleted}
            </span>
          </div>
        </div>
      </div>

      {/* Cloud & Supabase PostgreSQL Integration Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Outfit',sans-serif]">
                Supabase PostgreSQL Database
              </h3>
              <p className="text-xs text-slate-500">
                {supabaseConfig.isConnected
                  ? 'Connected to your Supabase project'
                  : 'Operating in high-speed offline-first mode with full persistent storage'}
              </p>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              supabaseConfig.isConnected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {supabaseConfig.isConnected ? 'Connected' : 'Local Active'}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            id="configure-supabase-btn"
            onClick={() => setShowDbModal(!showDbModal)}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
          >
            {showDbModal ? 'Hide Config' : 'Configure Supabase Keys'}
          </button>
        </div>

        {showDbModal && (
          <form onSubmit={handleSaveSupabase} className="mt-4 pt-3 border-t border-slate-100 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={dbKey}
                onChange={(e) => setDbKey(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {dbSavedMessage && (
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {dbSavedMessage}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                SQL schema is saved in <code className="text-slate-600">supabase_schema.sql</code>
              </span>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Save Keys
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Admin and Question Management Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Outfit',sans-serif]">
              Teacher & Admin Question Bank
            </h4>
            <p className="text-xs text-slate-500">
              Add questions, edit, delete, or bulk import via CSV.
            </p>
          </div>
        </div>

        <button
          id="profile-open-admin-btn"
          onClick={onOpenAdmin}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs shrink-0"
        >
          Open Admin
        </button>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-rose-900 text-xs sm:text-sm">
            Reset Learning Progress
          </h4>
          <p className="text-[11px] text-rose-700">
            Clears attempt history, test results, and bookmarks to start fresh.
          </p>
        </div>

        <button
          id="reset-progress-btn"
          onClick={onResetProgress}
          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-2xs shrink-0"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
