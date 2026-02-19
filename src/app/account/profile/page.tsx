import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from '@/components/account/ProfileForm';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = await getUserProfile(session.user.id);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Role</div>
                    <div className="font-medium text-gray-900">
                      {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                    </div>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-gray-600">Phone</div>
                      <div className="font-medium text-gray-900">{user.phone}</div>
                    </div>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-gray-600">Address</div>
                      <div className="font-medium text-gray-900">{user.address}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Member since</div>
                    <div className="font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}