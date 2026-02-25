import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Mail, Shield, Calendar, Save, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    company: "",
    bio: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || "",
        phone: userData.phone || "",
        company: userData.company || "",
        bio: userData.bio || "",
      });
    } catch (error) {
      console.error("Failed to load user", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: formData.full_name,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio
      });
      await loadUser();
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-sm text-slate-500">Manage your account information and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personal Information
              </CardTitle>
              {!editMode ? (
                <Button onClick={() => setEditMode(true)} variant="outline" size="sm">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setEditMode(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Save className="w-3.5 h-3.5 mr-1" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{user?.full_name || "User"}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 pt-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                  disabled={!editMode}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled className="mt-1.5 bg-slate-50 dark:bg-slate-900" />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  disabled={!editMode}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your company name"
                  disabled={!editMode}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Bio</Label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  disabled={!editMode}
                  className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 h-24 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Role</span>
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user?.role || "user"}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Member Since</span>
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {user?.created_date ? format(new Date(user.created_date), "MMM d, yyyy") : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-rose-200 dark:border-rose-900">
          <CardHeader>
            <CardTitle className="text-rose-600 dark:text-rose-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Sign Out</p>
                <p className="text-sm text-slate-500">You will be redirected to the login page</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}