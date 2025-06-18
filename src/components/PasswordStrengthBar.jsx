import React from 'react';

const PasswordStrengthBar = ({ password }) => {
  const calculateStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;
    return strength;
  };

  const strength = calculateStrength(password);
  const getColor = () => {
    if (strength < 40) return '#ef4444';
    if (strength < 70) return '#f97316';
    return '#22c55e';
  };

  return (
    <div className="password-strength">
      <div
        className="strength-bar"
        style={{ width: `${strength}%`, backgroundColor: getColor() }}
      />
    </div>
  );
};

export default PasswordStrengthBar;
