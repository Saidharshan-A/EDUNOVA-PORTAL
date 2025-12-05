import React from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, Building, Hash } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-gray-900">Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <div className="text-center">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto border-4 border-primary/20" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            {user.details?.grade && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Grade & Section</p>
                  <p className="font-medium">Grade {user.details.grade} - Section {user.details.section}</p>
                </div>
              </div>
            )}
            {user.details?.rollNo && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Roll Number</p>
                  <p className="font-medium">{user.details.rollNo}</p>
                </div>
              </div>
            )}
            {user.details?.department && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="text-gray-400" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium">{user.details.department}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
