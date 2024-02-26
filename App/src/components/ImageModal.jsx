import React from 'react';

const ImageModal = ({ children, onClose }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      {children}
      <button onClick={onClose} style={{ marginTop: '10px' }}>
        Close
      </button>
    </div>
  </div>
);

export default ImageModal;