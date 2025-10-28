// Import required packages
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin SDK
// This connects backend to Firebase with full admin 
// access
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to Firestore database
// Firestore is Firebase's NoSQL document database
const db = admin.firestore();

// Initialize Express app
const app = express();

// Middleware setup
// Middleware functions run before route handlers, processing the request
app.use(cors()); // Allow cross-origin requests from React app
app.use(express.json()); // Parse incoming JSON request bodies

// Port configuration
// The server will listen on this port
const PORT = process.env.PORT || 5000;

/**
 * SIGNUP ENDPOINT
 * POST /api/signup
 * Creates a new user account
 */
app.post('/api/signup', async (req, res) => {
  try {
    // Extract user data from request body
    const { firstName, lastName, age, barangay, number, password } = req.body;

    // Validation: Check if all required fields are present
    if (!firstName || !lastName || !age || !barangay || !number || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    // use firstName + baranggay as a unique identifier
    // since elderly users might have duplicate names
    const usersRef = db.collection('users');
    const existingUser = await usersRef
      .where('firstName', '==', firstName)
      .where('barangay', '==', barangay)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this name and address already exists' 
      });
    }

    // Hash the password
    // bcrypt adds a "salt" (random data) and hashes it multiple times
    // This makes it impossible to reverse-engineer the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document in Firestore
    const userDoc = await usersRef.add({
      firstName,
      lastName,
      age: parseInt(age), // Convert string to number
      barangay,
      number,
      password: hashedPassword, // Store hashed password, never plain text
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Timestamp from server
      appointments: [] // Initialize empty appointments array
    });

    // Return success response with user ID
    // We don't return the password (even hashed) to the client
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      userId: userDoc.id,
      user: {
        id: userDoc.id,
        firstName,
        lastName,
        age,
        barangay,
        number
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during signup',
      error: error.message 
    });
  }
});

/**
 * LOGIN ENDPOINT
 * POST /api/login
 * Authenticates a user and returns their data
 */
app.post('/api/login', async (req, res) => {
  try {
    const { firstName, barangay, password } = req.body;

    // Validation
    if (!firstName || !barangay || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'First name, address, and password are required' 
      });
    }

    // Find user by firstName and barangay
    const usersRef = db.collection('users');
    const userQuery = await usersRef
      .where('firstName', '==', firstName)
      .where('barangay', '==', barangay)
      .get();

    // Check if user exists
    if (userQuery.empty) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this name and address. Please create an account first.' 
      });
    }

    // Get the user document
    // userQuery.docs[0] gets the first (and should be only) matching document
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Verify password
    // bcrypt.compare() hashes the input password and compares it to the stored hash
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      });
    }

    // Login successful - return user data (without password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        barangay: userData.barangay,
        number: userData.number,
        createdAt: userData.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

/**
 * GET USER BY ID ENDPOINT
 * GET /api/users/:userId
 * Retrieves a specific user's information
 */
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userData = userDoc.data();
    
    // Return user data without password
    res.status(200).json({
      success: true,
      user: {
        id: userDoc.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        barangay: userData.barangay,
        number: userData.number,
        createdAt: userData.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

/*
 * GET ALL USERS ENDPOINT
 * GET /api/users
 * Retrieves all registered users (for admin purposes)
 */
app.get('/api/users', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        barangay: userData.barangay,
        number: userData.number,
        createdAt: userData.createdAt
        // Note: We never return passwords, even hashed
      });
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

/**
 * APPOINTMENT ENDPOINTS
 * These handle all appointment-related operations
 */

/**
 * GET USER APPOINTMENTS
 * GET /api/appointments/user/:userId
 * Retrieves all appointments for a specific user
 */
app.get('/api/appointments/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user document to access appointments
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userData = userDoc.data();
    const appointments = userData.appointments || [];

    res.status(200).json({
      success: true,
      appointments: appointments
    });

  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

/**
 * CREATE APPOINTMENT
 * POST /api/appointments
 * Creates a new appointment for a user
 */
app.post('/api/appointments', async (req, res) => {
  try {
    const { userId, ...appointmentData } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Check if user exists
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Create new appointment with ID
    const appointmentId = db.collection('appointments').doc().id;
    const newAppointment = {
      id: appointmentId,
      userId: userId,
      ...appointmentData,
      createdAt: new Date().toISOString(), // Use regular Date instead of serverTimestamp
      status: 'confirmed'
    };

    // Add appointment to user's appointments array
    const userData = userDoc.data();
    const updatedAppointments = [...(userData.appointments || []), newAppointment];

    await db.collection('users').doc(userId).update({
      appointments: updatedAppointments
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment: newAppointment
    });

  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

/**
 * UPDATE APPOINTMENT
 * PUT /api/appointments/:appointmentId
 * Updates an existing appointment
 */
app.put('/api/appointments/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;

    // Find the user who owns this appointment
    const usersSnapshot = await db.collection('users').get();
    let foundUser = null;
    let appointmentIndex = -1;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const appointments = userData.appointments || [];
      const index = appointments.findIndex(apt => apt.id === appointmentId);
      
      if (index !== -1) {
        foundUser = userDoc;
        appointmentIndex = index;
        break;
      }
    }

    if (!foundUser || appointmentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Update the appointment
    const userData = foundUser.data();
    const appointments = [...userData.appointments];
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString() // Use regular Date instead of serverTimestamp
    };

    await db.collection('users').doc(foundUser.id).update({
      appointments: appointments
    });

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: appointments[appointmentIndex]
    });

  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

/**
 * DELETE APPOINTMENT
 * DELETE /api/appointments/:appointmentId
 * Deletes an appointment
 */
app.delete('/api/appointments/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find the user who owns this appointment
    const usersSnapshot = await db.collection('users').get();
    let foundUser = null;
    let appointmentIndex = -1;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const appointments = userData.appointments || [];
      const index = appointments.findIndex(apt => apt.id === appointmentId);
      
      if (index !== -1) {
        foundUser = userDoc;
        appointmentIndex = index;
        break;
      }
    }

    if (!foundUser || appointmentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Remove the appointment
    const userData = foundUser.data();
    const appointments = [...userData.appointments];
    appointments.splice(appointmentIndex, 1);

    await db.collection('users').doc(foundUser.id).update({
      appointments: appointments
    });

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });  
});

// SELF-SERVICE PASSWORD RESET
// POST /api/auth/reset-password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { firstName, lastName, barangay, number, newPassword } = req.body;
    if (!firstName || !lastName || !barangay || !number || !newPassword) {
      return res.status(400).json({ success:false, message:'Missing fields' });
    }

    // Normalize phone if you store digits only
    const normalizedNumber = (number || '').replace(/\D/g, '');

    // Find user by identity fields
    const usersRef = db.collection('users');
    const snap = await usersRef
      .where('firstName', '==', firstName)
      .where('lastName', '==', lastName)
      .where('barangay', '==', barangay)
      .where('number', 'in', [number, normalizedNumber]) // handle both formats
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ success:false, message:'User not found' });

    const userRef = snap.docs[0].ref;

    // Hash new password and save (your schema uses field name \"password\")
    const hashed = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashed, updatedAt: new Date().toISOString() });

    return res.json({ success:true, message:'Password updated' });
  } catch (e) {
    console.error('reset-password error:', e);
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// ADMIN RESET PASSWORD
// PUT /api/users/:id/password
app.put('/api/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ success:false, message:'Missing newPassword' });

    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ success:false, message:'User not found' });

    // TODO: add admin auth/authorization here
    const hashed = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashed, updatedAt: new Date().toISOString() });

    return res.json({ success:true, message:'Password updated' });
  } catch (e) {
    console.error('admin password update error:', e);
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}/api/test`);
  console.log('Available endpoints:');
  console.log('- POST /api/signup');
  console.log('- POST /api/login');
  console.log('- GET /api/users');
  console.log('- GET /api/users/:userId');
  console.log('- GET /api/appointments/user/:userId');
  console.log('- POST /api/appointments');
  console.log('- PUT /api/appointments/:appointmentId');
  console.log('- DELETE /api/appointments/:appointmentId');
});