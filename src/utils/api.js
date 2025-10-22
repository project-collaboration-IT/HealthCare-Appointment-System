// API base URL
// In development, this points to localhost backend
// In production, change this to backend URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Signup API call
 * Sends user registration data to the backend
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tell server we're sending JSON
      },
      body: JSON.stringify(userData), // Convert JavaScript object to JSON string
    });
    
    // Parse the JSON response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      // If not, throw an error with the message from the backend
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  } catch (error) {
    // Re-throw the error so the calling code can handle it
    throw error;
  }
};

/**
 * Login API call
 * Authenticates a user and retrieves their data
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users (for testing purposes)
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    throw error;
  }
};