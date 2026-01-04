import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayWorkout, createLog, getPlan } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Today = () => {
  const [todayLog, setTodayLog] = useState(null);
  const [dayTemplate, setDayTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    status: 'completed',
    weight: '',
    energy: '',
    sleep: '',
    rpe: '',
    notes: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayWorkout();
  }, []);

  const fetchTodayWorkout = async () => {
    try {
      const response = await getTodayWorkout();
      const log = response.data.data;

      if (log) {
        setTodayLog(log);
        setDayTemplate(log.dayTemplate);
        setFormData({
          status: log.status,
          weight: log.weight || '',
          energy: log.energy || '',
          sleep: log.sleep || '',
          rpe: log.rpe || '',
          notes: log.notes || ''
        });
      } else {
        // No log for today yet, need to get the day template from the plan
        await fetchCurrentDayTemplate();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load today\'s workout');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentDayTemplate = async () => {
    try {
      if (!user.activePlan) {
        setError('No active plan. Please activate a plan first.');
        return;
      }

      const response = await getPlan(user.activePlan);
      const plan = response.data.data;

      // Find current phase
      const currentPhase = plan.phases.find(p => p.number === plan.currentPhase);
      if (!currentPhase || !currentPhase.weeks.length) {
        setError('No workout scheduled for today');
        return;
      }

      // For simplicity, get the first day of the first week
      // In a real app, you'd calculate which day based on plan start date
      const firstWeek = currentPhase.weeks[0];
      const firstDay = firstWeek.days[0];

      if (firstDay) {
        setDayTemplate(firstDay);
      } else {
        setError('No workout template found');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load workout template');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const logData = {
        date: new Date().toISOString(),
        dayTemplateId: dayTemplate._id,
        status: formData.status,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        energy: formData.energy ? parseInt(formData.energy) : null,
        sleep: formData.sleep ? parseFloat(formData.sleep) : null,
        rpe: formData.rpe ? parseInt(formData.rpe) : null,
        notes: formData.notes
      };

      await createLog(logData);
      setSuccess('Workout logged successfully!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log workout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !dayTemplate) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (todayLog) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Today's Workout</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Already Logged
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium">{format(new Date(todayLog.date), 'MMMM d, yyyy')}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                todayLog.status === 'completed' ? 'bg-green-100 text-green-800' :
                todayLog.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {todayLog.status}
              </span>
            </div>

            {todayLog.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-lg">{todayLog.notes}</p>
              </div>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Today's Workout</h2>

        {/* Day Template Display */}
        {dayTemplate && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {dayTemplate.type === 'routine' && dayTemplate.routineTemplate
                ? dayTemplate.routineTemplate.name
                : `Day ${dayTemplate.dayNumber} Workout`}
            </h3>

            {dayTemplate.type === 'structured' && dayTemplate.structuredExercises && (
              <div className="space-y-2">
                {dayTemplate.structuredExercises.map((exercise, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-medium">{exercise.movement}</span>
                    <span className="text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps
                    </span>
                  </div>
                ))}
              </div>
            )}

            {dayTemplate.type === 'routine' && dayTemplate.routineTemplate && (
              <div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {dayTemplate.routineTemplate.description}
                </p>
                {dayTemplate.routineTemplate.attachment && (
                  <div className="mt-3">
                    <a
                      href={`http://localhost:5000/${dayTemplate.routineTemplate.attachment.storagePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Logging Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {['completed', 'partial', 'skipped'].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Body Weight (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="energy" className="block text-sm font-medium text-gray-700">
                Energy Level (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                id="energy"
                name="energy"
                value={formData.energy}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="sleep" className="block text-sm font-medium text-gray-700">
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.5"
                id="sleep"
                name="sleep"
                value={formData.sleep}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="rpe" className="block text-sm font-medium text-gray-700">
                Session RPE (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                id="rpe"
                name="rpe"
                value={formData.rpe}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={500}
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Any notes about today's workout..."
            />
            <p className="mt-1 text-sm text-gray-500">{formData.notes.length}/500 characters</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || !dayTemplate}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Logging...' : 'Log Workout'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Today;
