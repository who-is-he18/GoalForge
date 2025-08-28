// src/services/goalService.js
import api from './api';

export const goalService = {
  getGoal: async (id) => {
    const response = await api.get(`/api/goals/${id}`);
    return response.data;
  },
  
  getGoalProgress: async (goalId) => {
    const response = await api.get(`/api/progress?goal_id=${goalId}`);
    return response.data;
  },
  
  addProgress: async (progressData) => {
    const response = await api.post('/api/progress', progressData);
    return response.data;
  },
  
  updateGoal: async (id, updateData) => {
    const response = await api.patch(`/api/goals/${id}`, updateData);
    return response.data;
  },
  
  deleteGoal: async (id) => {
    const response = await api.delete(`/api/goals/${id}`);
    return response.data;
  }
};