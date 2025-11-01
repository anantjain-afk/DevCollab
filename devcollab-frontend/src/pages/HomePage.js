import React from 'react';
import { Link } from 'react-router-dom'; // We'll use this for temporary navigation

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to DevCollab</h1>
      <nav>
        <p>This is the temporary home page.</p>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
};

export default HomePage;