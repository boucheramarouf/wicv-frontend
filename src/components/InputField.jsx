import React from 'react';

const InputField = ({ icon, placeholder, name, type, value, onChange, required, error }) => (
  <div style={{ position: 'relative' }}>
    <span className="sign-input-icon">
      <i className={icon}></i>
    </span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`sign-input-field ${error ? 'error' : ''}`}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default InputField;