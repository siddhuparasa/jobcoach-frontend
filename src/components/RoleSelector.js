import React from 'react';

const RoleSelector = ({ selectedRole, setSelectedRole }) => {
 const roles = ['DSA', 'ML', 'Web Developer', 'DBMS', 'CN', 'OS', 'System Design', 'DevOps'];


  return (
    <select
      value={selectedRole}
      onChange={(e) => setSelectedRole(e.target.value)}
      className="p-2 rounded border"
    >
      {roles.map(role => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
};

export default RoleSelector;
