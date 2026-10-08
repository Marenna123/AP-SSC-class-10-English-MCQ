import React, { useState } from 'react';
import { User, Award, ShieldCheck, RefreshCw, Edit2, Save, ExternalLink, Smartphone } from 'lucide-react';
import { StudentProfile } from '../types';
import { OverallStats } from '../lib/storage';

interface ProfileViewProps {
  profile: StudentProfile;
  stats: OverallStats;
  onUpdateProfile: (updates: Partial<StudentProfile>) => void;
  onOpenAdmin: () => void;
  onOpenInstall?: () => void;
  onResetProgress: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  stats,
  onUpdateProfile,
  onOpenAdmin,
  onOpenInstall,
  onResetProgress,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editSchool, setEditSchool] = useState(profile.school || '');

  const handleSaveProfile = () => {
    if (editName.trim()) {
      onUpdateProfile({ name: editName.trim(), school: editSchool.trim() });
      setIsEditing(false);
    }
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

      {/* Android Phone App Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Outfit',sans-serif]">
              Install on Android Phone
            </h4>
            <p className="text-xs text-slate-500">
              Instant WebAPK or standalone APK package.
            </p>
          </div>
        </div>

        {onOpenInstall && (
          <button
            id="profile-open-install-btn"
            onClick={onOpenInstall}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Install / APK</span>
          </button>
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
