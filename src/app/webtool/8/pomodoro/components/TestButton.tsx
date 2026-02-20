'use client';

export default function TestButton() {
  return (
    <button
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'red',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px'
      }}
      onClick={() => alert('Test button works!')}
    >
      T
    </button>
  );
}
