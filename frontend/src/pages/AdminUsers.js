import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  errorText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#f4f6f8',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left',
  },
  row: {
    transition: 'background-color 0.3s ease',
  },
  rowHover: {
    backgroundColor: '#f9f9f9',
  },
  removeButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  removeButtonHover: {
    backgroundColor: '#c9302c',
  },
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [removeHoverIndex, setRemoveHoverIndex] = useState(null);

  useEffect(() => {
    // Check admin access
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn) {
      window.location.href = '/';
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove user');
      }
      // Remove user from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <div style={{...styles.header, marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Admin Panel - Manage Users</h1>
        <div>
        <button
            style={{...styles.logoutButton, backgroundColor: '#007bff', marginLeft: '0.3rem'}}
            onClick={() => window.location.href = '/admin/'}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Manage Orders
          </button>
          <>   </>
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            Logout
          </button>
          
        </div>
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p style={styles.errorText}>{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                style={hoveredRow === index ? {...styles.row, ...styles.rowHover} : styles.row}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>{user._id}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <button
                    style={removeHoverIndex === index ? {...styles.removeButton, ...{backgroundColor: '#c9302c'}} : styles.removeButton}
                    onMouseEnter={() => setRemoveHoverIndex(index)}
                    onMouseLeave={() => setRemoveHoverIndex(null)}
                    onClick={() => handleRemoveUser(user._id)}
                    aria-label={`Remove user ${user.name}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
