import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertCircle, CheckCircle2, Loader2, LogOut } from 'lucide-react';

import useAuthStore from '@/stores/auth.store';

import authService, { type LoginFeedback } from '@/services/auth.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  useBreadcrumb([{ title: 'Profile' }]);

  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string | Record<string, string[]>;
  } | null>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        username: user.username,
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result: LoginFeedback = await authService.updateProfile(profileData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
      // Refresh user data
      const updatedProfile = await authService.getProfile();
      if (updatedProfile.success && updatedProfile.data) {
        setUser(updatedProfile.data);
      }
    } else {
      setMessage({ type: 'error', text: result.errorDetails || 'Gagal memperbarui profil.' });
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result: LoginFeedback = await authService.changePassword(passwordData);

    if (result.success) {
      setMessage({ type: 'success', text: 'Password berhasil diubah.' });
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } else {
      setMessage({ type: 'error', text: result.errorDetails || 'Gagal mengubah password.' });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <LayoutContent>
      <PageHead title="Profil Saya" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Profile</LayoutContentHead>
            <LayoutContentSubHead>Kelola profil akun anda</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Detail Profil</TabsTrigger>
            <TabsTrigger value="password">Ganti Password</TabsTrigger>
          </TabsList>

          {message && (
            <Alert
              variant={message.type === 'error' ? 'destructive' : 'default'}
              className={
                message.type === 'success' ? 'border-green-500 bg-green-50 text-green-700' : ''
              }
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{message.type === 'success' ? 'Berhasil' : 'Error'}</AlertTitle>
              <AlertDescription>
                {typeof message.text === 'string' ? (
                  <p>{message.text}</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm">
                    {Object.entries(message.text).map(([key, msgs]) => (
                      <li key={key}>{msgs[0]}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
                <CardDescription>Perbarui nama dan detail kontak anda.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-6">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Perubahan
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Ubah password anda. Pastikan menggunakan password yang aman.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Password Saat Ini</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, current_password: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Password Baru</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordData.password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, password: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwordData.password_confirmation}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, password_confirmation: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-6">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Ubah Password
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end border-t pt-6">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
