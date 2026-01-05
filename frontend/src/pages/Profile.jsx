import React from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>

        <div className="space-y-6">
          {/* User Info */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Active Plan</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.activePlan ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>
          </div>

          {/* App Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">About This App</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-700">
              <p><strong>Workout Tracker</strong> - Version 1.0</p>
              <p>A simple workout tracking application for monitoring adherence to structured workout plans.</p>
              <p className="pt-2 border-t border-gray-200">
                <strong>Features:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Track daily workout completion and progress</li>
                <li>View progress across phases and weeks</li>
                <li>Create custom routine templates</li>
                <li>Monitor metrics like weight, energy, sleep, and RPE</li>
                <li>Export workout history to CSV</li>
                <li>Calendar heatmap visualization</li>
              </ul>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Tips</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-blue-900">
                <li>• Log workouts within 24 hours for best tracking</li>
                <li>• Use the "Today" page for quick daily logging (under 30 seconds)</li>
                <li>• Track optional metrics (energy, sleep) for deeper insights</li>
                <li>• Create custom routines for exercises not in your plan</li>
                <li>• Export your data regularly to keep a backup</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
