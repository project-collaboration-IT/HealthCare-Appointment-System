// API base URL - change this to your backend URL
const API_BASE_URL = 'https://healthcare-for-render.onrender.com/api';

// Mock data for when backend is not available
let mockAppointments = [];
let mockUsers = [];
let nextAppointmentId = 1;
let nextUserId = 1;

// Helper function to check if we should use mock data
const shouldUseMockData = () => {
  // Set to true if backend is down for testing
  return false;
};

// Helper function to handle API errors with fallback
const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  console.error('API error:', error);
  
  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
  }
  
  // Handle CORS errors
  if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
    throw new Error('CORS error: Please check if the backend server is running and allows cross-origin requests.');
  }
  
  throw error;
};

// Signup function
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = 'Signup failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, 'Signup failed');
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, 'Login failed');
  }
};

// Get all users function (for admin panel)
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    console.error('Get users API error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    return data;
  } catch (error) {
    console.error('Get user API error:', error);
    throw error;
  }
};

// Get all appointments for a user
export const getUserAppointments = async (userId) => {
  if (shouldUseMockData()) {
    // Return mock data
    const userAppointments = mockAppointments.filter(apt => apt.userId === userId);
    return {
      success: true,
      appointments: userAppointments
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch appointments');
    }

    return data;
  } catch (error) {
    console.error('Get user appointments API error:', error);
    throw error;
  }
};

// Create new appointment
export const createAppointment = async (userId, appointmentData) => {
  if (shouldUseMockData()) {
    // Create mock appointment
    const newAppointment = {
      id: nextAppointmentId++,
      userId: userId,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    mockAppointments.push(newAppointment);
    
    return {
      success: true,
      message: 'Appointment created successfully',
      appointment: newAppointment
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...appointmentData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create appointment');
    }

    return data;
  } catch (error) {
    console.error('Create appointment API error:', error);
    throw error;
  }
};

// Update existing appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
  if (shouldUseMockData()) {
    // Update mock appointment
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
    if (appointmentIndex !== -1) {
      mockAppointments[appointmentIndex] = {
        ...mockAppointments[appointmentIndex],
        ...appointmentData,
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        message: 'Appointment updated successfully',
        appointment: mockAppointments[appointmentIndex]
      };
    } else {
      throw new Error('Appointment not found');
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update appointment');
    }

    return data;
  } catch (error) {
    console.error('Update appointment API error:', error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  if (shouldUseMockData()) {
    // Delete mock appointment
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
    if (appointmentIndex !== -1) {
      mockAppointments.splice(appointmentIndex, 1);
      return {
        success: true,
        message: 'Appointment deleted successfully'
      };
    } else {
      throw new Error('Appointment not found');
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete appointment');
    }

    return data;
  } catch (error) {
    console.error('Delete appointment API error:', error);
    throw error;
  }
};

// REQUEST: Self-service password reset by verifying user identity fields
export const resetPasswordSelf = async (payload) => {
  // payload: { firstName, lastName, barangay, number, newPassword }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      const message = typeof body === 'object' && body !== null ? (body.message || JSON.stringify(body)) : (body || `${response.status} ${response.statusText}`);
      throw new Error(message);
    }

    return typeof body === 'object' && body !== null ? body : { success: true, message: body };
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};

// REQUEST: Admin password reset for a specific user
export const resetPasswordAdmin = async (userId, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      const message = typeof body === 'object' && body !== null ? (body.message || JSON.stringify(body)) : (body || `${response.status} ${response.statusText}`);
      throw new Error(message);
    }

    return typeof body === 'object' && body !== null ? body : { success: true, message: body };
  } catch (error) {
    console.error('Admin reset password API error:', error);
    throw error;
  }
};
