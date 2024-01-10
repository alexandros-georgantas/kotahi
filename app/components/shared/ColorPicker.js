import React from 'react'

const ColorPicker = ({ onChange, required, value }) => {
  return (
    <div style={{ position: 'relative', width: '30px', height: '30px' }}>
      <input
        onChange={event => onChange(event.target.value)}
        required={required}
        style={{
          position: 'absolute',
          cursor: 'pointer',
          opacity: 0,
          zIndex: 2,
        }}
        type="color"
        value={value}
      />
      <div
        className="form-control"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          outline: `${value} 1px solid`,
          outlineOffset: '2px',
          backgroundColor: value,
          borderRadius: '50%',
        }}
      />
    </div>
  )
}

export default ColorPicker
