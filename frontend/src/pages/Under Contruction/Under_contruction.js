import React from 'react';
import Header from '../../components/Header/Header';

function UnderContruction() {
  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Under Construction</h1>
        <p>This page is currently unavailable, please try again later.</p>
        <p>Kind regards - Management.</p>
      </div>
    </div>
  );
}

export default UnderContruction;
