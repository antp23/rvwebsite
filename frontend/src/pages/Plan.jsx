import React, { useState, useEffect } from 'react';
import { getPlan } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Plan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPhases, setExpandedPhases] = useState([]);
  const [expandedWeeks, setExpandedWeeks] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.activePlan) {
      fetchPlan();
    } else {
      setLoading(false);
      setError('No active plan');
    }
  }, [user]);

  const fetchPlan = async () => {
    try {
      const response = await getPlan(user.activePlan);
      setPlan(response.data.data);
      // Auto-expand first phase
      if (response.data.data.phases.length > 0) {
        setExpandedPhases([response.data.data.phases[0]._id]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev =>
      prev.includes(weekId)
        ? prev.filter(id => id !== weekId)
        : [...prev, weekId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800">{error || 'No plan available'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
          <p className="text-gray-600 mt-1">
            Current Phase: {plan.currentPhase} of {plan.phases.length}
          </p>
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {plan.phases.map((phase) => (
            <div key={phase._id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => togglePhase(phase._id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    phase.number === plan.currentPhase
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {phase.number}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                    <p className="text-sm text-gray-500">{phase.weeksCount} weeks</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedPhases.includes(phase._id) ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedPhases.includes(phase._id) && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Weeks */}
                  {phase.weeks.map((week) => (
                    <div key={week._id} className="border-l-2 border-gray-200 pl-4">
                      <button
                        onClick={() => toggleWeek(week._id)}
                        className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2"
                      >
                        <div>
                          <span className="font-medium text-gray-900">Week {week.number}</span>
                          {week.isDeload && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Deload
                            </span>
                          )}
                        </div>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedWeeks.includes(week._id) ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedWeeks.includes(week._id) && (
                        <div className="mt-2 space-y-2 pl-4">
                          {/* Days */}
                          {week.days.map((day) => (
                            <div key={day._id} className="p-3 bg-gray-50 rounded">
                              <p className="font-medium text-gray-900 mb-2">
                                Day {day.dayNumber}
                              </p>

                              {day.type === 'structured' && day.structuredExercises && (
                                <div className="space-y-1 text-sm">
                                  {day.structuredExercises.map((exercise, idx) => (
                                    <div key={idx} className="flex justify-between text-gray-700">
                                      <span>{exercise.movement}</span>
                                      <span className="text-gray-500">
                                        {exercise.sets} × {exercise.reps}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {day.type === 'routine' && day.routineTemplate && (
                                <div className="text-sm text-gray-700">
                                  <p className="font-medium">{day.routineTemplate.name}</p>
                                  <p className="text-gray-600 mt-1">{day.routineTemplate.description}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plan;
