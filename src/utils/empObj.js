import { doc } from "firebase/firestore";
import db from "../firebase";

const stat_obj = () => {
  const education_info = {
    completion_date: '' || '',
    degree: '' || '',
    grade: '' || '',
    institute: '' || '',
    start_date: '' || '',
    subject: '' || ''
  };
  
  const personal_info = {
    children: '' || '',
    marital_status: '' || '',
    nationality: '' || '',
    passport_expiry: '' || '',
    passport_no: '' || '',
    phone: '' || '',
    religion: '' || '',
    spouse_job: '' || '',
    gender: '' || '',
    birthday: '' || '',
    reports_to: '' || '',
    address: '' || '',
    state: '' || '',
    country: '' || '',
  };

  const emergency_contact = {
    primary_name: '' || '',
    primary_phone: '' || '',
    primary_relationship: '' || '',
    secondary_name: '' || '',
    secondary_phone: '' || '',
    secondary_relationship: '' || ''
  };

  const family_info = {
    date_of_birth: '' || '',
    name: '' || '',
    phone: '' || '',
    relationship: '' || ''
  };
  
  const experience = {
    company_name: '' || '',
    job_position: ''  || '',
    location: '' || '',
    period_from: '' || '',
    period_to: '' || ''
  };
  
  const bank_info = {
    bank_account: '' || '',
    bank_name: '' || '',
    ifsc_code: '' || '',
    pan_no: '' || ''
  };

  return { bank_info, experience, education_info, personal_info, family_info, emergency_contact };
}

export const objs = (userID, data = {}, roles = [], selectedDate1 = '') => {
  const user = {
    username: data.username || '',
    fname: data.fname || '',
    lname: data.lname || '',
    email: data.email || '',
    password: data.password || '',
    phone: data.phone || '',
    employeeID: data.employeeID || '',
    join_date: JSON.stringify(selectedDate1) || '',
    company: data.company?.value || '',
    designation: data.designation?.value || '',
    department: data.department?.value || '',
    profile_cover: '',
    admin: false,
  };

  const role_data = roles.reduce((acc, role) => {
    const roleName = role.role.toLowerCase();
    acc[roleName] = {
      read: data[`${roleName}_read`] || false,
      write: data[`${roleName}_write`] || false,
      create: data[`${roleName}_create`] || false,
      delete: data[`${roleName}_delete`] || false,
      import: data[`${roleName}_import`] || false,
      export: data[`${roleName}_export`] || false,
    };
    return acc;
  }, {});

  const {bank_info, experience, education_info, personal_info, family_info, emergency_contact} = stat_obj()

  const userData1 = [
    { ref: doc(db, 'user', userID), data: user },
    { ref: doc(db, 'user', userID, 'profile', userID, 'personal_info', userID), data: personal_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'emergency_contact', userID), data: emergency_contact },
    { ref: doc(db, 'user', userID, 'profile', userID, 'bank_info', userID), data: bank_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'family_info', userID), data: family_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'education_info', userID), data: education_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'experience', userID), data: experience },
  ];

  const userData2 = Object.entries(role_data).map(([roleName, permissions]) => ({
    ref: doc(db, 'user', userID, 'roles', userID, roleName, userID),
    data: permissions,
  }));

  const userData = [...userData1, ...userData2];
  
  return userData;
};

export const update_objs = (userID, data = {}, roles = [], selectedDate1 = '') => {
  const user = {
    username: data.username || '',
    fname: data.fname || '',
    lname: data.lname || '',
    email: data.email || '',
    password: data.password || '',
    phone: data.phone || '',
    employeeID: data.employeeID || '',
    join_date: JSON.stringify(selectedDate1) || '',
    company: data.company?.value || '',
    designation: data.designation?.value || '',
    department: data.department?.value || '',
    admin: false,
  };

  const role_data = roles.reduce((acc, role) => {
    const roleName = role.role.toLowerCase();
    acc[roleName] = {
      read: data[`${roleName}_read`] || false,
      write: data[`${roleName}_write`] || false,
      create: data[`${roleName}_create`] || false,
      delete: data[`${roleName}_delete`] || false,
      import: data[`${roleName}_import`] || false,
      export: data[`${roleName}_export`] || false,
    };
    return acc;
  }, {});

  console.log(user, userID);
  const userData1 = [
    { ref: doc(db, 'user', userID), data: user },
  ];

  const userData2 = Object.entries(role_data).map(([roleName, permissions]) => ({
    ref: doc(db, 'user', userID, 'roles', userID, roleName, userID),
    data: permissions,
  }));

  const userData = [...userData1, ...userData2];
  console.log(userData);
  
  return userData;
};

export const admin_objs = (userID, data = {}, roles = [], selectedDate1 = '') => {
  const user = {
    username: data.username || '',
    fname: data.fname || '',
    lname: data.lname || '',
    email: data.email || '',
    password: data.password || '',
    phone: data.phone || '',
    employeeID: data.employeeID || '',
    join_date: JSON.stringify(selectedDate1) || '',
    company: data.company?.value || '',
    designation: data.designation?.value || '',
    department: data.department?.value || '',
    admin: true,
  };

  const role_data = roles.reduce((acc, role) => {
    const roleName = role.role.toLowerCase();
    acc[roleName] = {
      read: data[`${roleName}_read`] || true,
      write: data[`${roleName}_write`] || true,
      create: data[`${roleName}_create`] || true,
      delete: data[`${roleName}_delete`] || true,
      import: data[`${roleName}_import`] || true,
      export: data[`${roleName}_export`] || true,
    };
    return acc;
  }, {});

  const {bank_info, experience, education_info, personal_info, family_info, emergency_contact} = stat_obj()

  const userData1 = [
    { ref: doc(db, 'user', userID), data: user },
    { ref: doc(db, 'user', userID, 'profile', userID, 'personal_info', userID), data: personal_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'emergency_contact', userID), data: emergency_contact },
    { ref: doc(db, 'user', userID, 'profile', userID, 'bank_info', userID), data: bank_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'family_info', userID), data: family_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'education_info', userID), data: education_info },
    { ref: doc(db, 'user', userID, 'profile', userID, 'experience', userID), data: experience },
  ];


  const userData2 = Object.entries(role_data).map(([roleName, permissions]) => ({
    ref: doc(db, 'user', userID, 'roles', userID, roleName, userID), data: permissions,
  }));

  const userData = [...userData1, ...userData2];

  return userData;
};