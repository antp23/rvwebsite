import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../utils/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!dashboard?.hasActivePlan) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No active plan</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by selecting a workout plan.</p>
        <div className="mt-6">
          <Link
            to="/plan"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  const { plan, phaseProgress, streak, weeklyCompletion, recentLogs, averages } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/today"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Log Today's Workout
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Streak */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Current Streak</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{streak} days</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{plan.currentPhase}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{phaseProgress}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Completion */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Weekly Completion</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{weeklyCompletion}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Plan */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Plan</dt>
                  <dd className="text-lg font-semibold text-gray-900 truncate">{plan.name}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Averages */}
      {averages && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Average Metrics (Last 30 Days)</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {averages.weight && (
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{averages.weight} lbs</p>
                <p className="text-sm text-gray-500">Weight</p>
              </div>
            )}
            {averages.energy && (
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{averages.energy}/10</p>
                <p className="text-sm text-gray-500">Energy</p>
              </div>
            )}
            {averages.sleep && (
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{averages.sleep} hrs</p>
                <p className="text-sm text-gray-500">Sleep</p>
              </div>
            )}
            {averages.rpe && (
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{averages.rpe}/10</p>
                <p className="text-sm text-gray-500">RPE</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Logs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Workouts</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentLogs.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No workouts logged yet. <Link to="/today" className="text-primary-600 hover:text-primary-700">Start logging!</Link>
            </li>
          ) : (
            recentLogs.map((log) => (
              <li key={log._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {log.dayTemplate?.type === 'routine' && log.dayTemplate.routineTemplate
                        ? log.dayTemplate.routineTemplate.name
                        : `Day ${log.dayTemplate?.dayNumber || 'N/A'}`}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : log.status === 'partial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : log.status === 'skipped'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
                {log.notes && (
                  <p className="mt-2 text-sm text-gray-600">{log.notes}</p>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
