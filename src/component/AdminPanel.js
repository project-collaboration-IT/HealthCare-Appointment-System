//this if for admin panel, wala pa siyang nasyadong usage 
//except for checking the user account creation
//don;t galaw galaw this muna unless meron kau suggestions, lobe u

import { useState, useEffect, useMemo } from 'react';
import { getAllUsers, getUserAppointments, resetPasswordAdmin } from '../utils/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'appointments'
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [errorAppointments, setErrorAppointments] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setErrorUsers('');
      const response = await getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      setErrorUsers(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const parseAppointmentDate = (selectedDate, selectedTime) => {
    // selectedDate like 'Wed Oct 29 2025' or similar, selectedTime like '8:30 AM'
    // Fallback to Date(selectedDate) if time missing
    const base = new Date(selectedDate);
    if (!selectedTime) return base;
    try {
      const [time, period] = selectedTime.split(' ');
      const [h, m] = time.split(':').map(Number);
      let hours = h % 12;
      if (period && period.toUpperCase() === 'PM') hours += 12;
      const withTime = new Date(base);
      withTime.setHours(hours, isNaN(m) ? 0 : m, 0, 0);
      return withTime;
    } catch {
      return base;
    }
  };

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);
      setErrorAppointments('');
      // Ensure users are loaded
      if (users.length === 0) {
        await loadUsers();
      }
      const list = await Promise.all(
        (users || []).map(async (u) => {
          try {
            const res = await getUserAppointments(u.id);
            const items = (res.appointments || []).map(a => ({
              ...a,
              userId: u.id,
              userFirstName: u.firstName,
              userLastName: u.lastName,
              userAddress: u.barangay,
              userPhone: u.number,
              sortDate: parseAppointmentDate(a.selectedDate, a.selectedTime)
            }));
            return items;
          } catch (e) {
            return [];
          }
        })
      );
      const flat = list.flat();
      // Only future + today; keep past as well if needed
      flat.sort((a, b) => a.sortDate - b.sortDate);
      setAppointments(flat);
    } catch (error) {
      setErrorAppointments(error.message);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Load appointments when switching to the tab (first time or on demand)
  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light text-gray-800 mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm ${activeTab === 'users' ? 'border-b-2 border-green-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`ml-4 px-4 py-2 text-sm ${activeTab === 'appointments' ? 'border-b-2 border-green-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Appointments
            </button>
          </nav>
        </div>

        {activeTab === 'users' && (
          <>
            {errorUsers && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{errorUsers}</p>
              </div>
            )}

            {loadingUsers ? (
              <div className="bg-white rounded-lg shadow p-6 text-gray-600">Loading users...</div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.age}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {user.barangay}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt._seconds * 1000).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => { setPasswordModalUser(user); setNewPassword(''); setPasswordError(''); setShowPasswordModal(true); }}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                              Reset Password
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-gray-600">Total users: {users.length}</p>
              </>
            )}
          </>
        )}

        {activeTab === 'appointments' && (
          <>
            {errorAppointments && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{errorAppointments}</p>
              </div>
            )}

            {loadingAppointments ? (
              <div className="bg-white rounded-lg shadow p-6 text-gray-600">Loading appointments...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Info</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((apt) => (
                      <>
                        <tr key={apt.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.selectedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{apt.selectedTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apt.userFirstName} {apt.userLastName}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{apt.userAddress}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.userPhone}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {apt.symptoms ? Object.keys(apt.symptoms).filter(k => (apt.symptoms[k] || []).length > 0).slice(0,3).join(', ') : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => setExpandedRows(prev => ({ ...prev, [apt.id]: !prev[apt.id] }))}
                              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                              {expandedRows[apt.id] ? 'Hide' : 'View'} Details
                            </button>
                          </td>
                        </tr>
                        {expandedRows[apt.id] && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                              <div className="grid gap-4 md:grid-cols-3">
                                <div className="bg-white border rounded p-3">
                                  <h4 className="font-medium text-sm text-gray-800 mb-2">Symptoms</h4>
                                  {apt.symptoms ? (
                                    <ul className="text-xs text-gray-700 space-y-1">
                                      {Object.entries(apt.symptoms).map(([cat, items]) => (
                                        (items && items.length > 0) ? (
                                          <li key={cat}><span className="font-medium">{cat}:</span> {items.join(', ')}</li>
                                        ) : null
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-gray-500">No data</p>
                                  )}
                                </div>
                                <div className="bg-white border rounded p-3">
                                  <h4 className="font-medium text-sm text-gray-800 mb-2">Recent Meals</h4>
                                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{apt.recentMeals || '—'}</p>
                                </div>
                                <div className="bg-white border rounded p-3">
                                  <h4 className="font-medium text-sm text-gray-800 mb-2">Medications</h4>
                                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{apt.medications || '—'}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Admin Reset Password Modal */}
        {showPasswordModal && passwordModalUser && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => !savingPassword && setShowPasswordModal(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Reset Password</h3>
                  <button onClick={() => !savingPassword && setShowPasswordModal(false)} className="p-2 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{passwordModalUser.firstName} {passwordModalUser.lastName} — {passwordModalUser.number}</p>
                {passwordError && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{passwordError}</div>
                )}
                <label className="block text-sm text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-green-500"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setShowPasswordModal(false)} disabled={savingPassword} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                  <button
                    onClick={async () => {
                      if (!newPassword || newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); return; }
                      try {
                        setSavingPassword(true);
                        setPasswordError('');
                        await resetPasswordAdmin(passwordModalUser.id, newPassword);
                        setShowPasswordModal(false);
                      } catch (e) {
                        setPasswordError(e.message);
                      } finally {
                        setSavingPassword(false);
                      }
                    }}
                    disabled={savingPassword}
                    className={`px-4 py-2 rounded text-white ${savingPassword ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {savingPassword ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;