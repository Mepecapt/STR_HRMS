import { getDocs, getDoc, collection, doc, onSnapshot, query } from "firebase/firestore";
import db from "../firebase";  // Ensure this points to your Firebase config
import { getAuth } from "firebase/auth";
import Cookies from 'js-cookie'
import { useState } from "react";

// Function to get the current authenticated user
export const current_user = () => {
  const user = JSON.parse(Cookies.get('user'))
  
  return user;
};

// Function to create a unique document ID based on the current user
export const create_docID = (table) => {
  const user = JSON.parse(Cookies.get('user'))
  const userID = user.uid
  
  if (!userID) {
    console.error("No user is currently authenticated.");
    return null;
  }

  const currTime = new Date().toLocaleTimeString();
  const docID = `${userID}_${table}_${currTime}`;
  
  return docID;
};

// Function to fetch documents from a Firestore collection and return them
export const stat_fetcher = async (table) => {
  try {
    const querySnapshot = await getDocs(collection(db, table))
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return docs; // Return the fetched documents array
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to fetch documents from a Firestore collection and return them
export const fetcher = async (table) => {
  try {
    const querySnapshot = await getDocs(collection(db, table))
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return docs; // Return the fetched documents array
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to fetch documents from a Firestore collection and return them


// Function to fetch documents from a specific path in Firestore
export const profile_fetch = async (table) => {
  const user = current_user();
  const userID = user.uid;  
  
  try {
    const profileCollection = doc(db, 'user', userID, 'profile', userID, table, userID)
    const querySnapshot = await getDoc(profileCollection);
    const docs = querySnapshot.data()
    
    return docs; // Return the fetched documents array
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
};

export const role_fetch = async (update_doc) => {
  try {
    const profileCollection = doc(db, 'user', update_doc, 'roles', update_doc)
    const querySnapshot = await getDoc(profileCollection);
    const docs = querySnapshot.data()
    
    return docs; // Return the fetched documents array
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
}
// Function to fetch a single document using the current user's ID
export const fetcher2 = async (table) => {
  try {
    const user = current_user()

    if (!user) {
      console.error("No user is currently authenticated.");
      return null;
    }

    const documentRef = doc(db, table, user.uid); // Create a reference to the document
    const documentSnapshot = await getDoc(documentRef); // Use getDoc to fetch the single document
    
    if (documentSnapshot.exists()) {
      // If the document exists, return its data
      return { id: documentSnapshot.id, ...documentSnapshot.data() };
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null; // Return null in case of an error
  }
};

export const fetcher3 = async (table, docID) => {
  try {
    const documentRef = doc(db, table, docID); // Create a reference to the document
    const documentSnapshot = await getDoc(documentRef); // Use getDoc to fetch the single document
    
    if (documentSnapshot.exists()) {
      // If the document exists, return its data
      return { id: documentSnapshot.id, ...documentSnapshot.data() };
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null; // Return null in case of an error
  }
};

// Function to fetch documents and set the data state using the fetched data
export const fetch_save = async (table, setData) => {
  const data = await fetcher(table); // Fetch data using the fetcher function
  setData(data); // Update the state with the fetched data
};

// Function to fetch a document and set the data state using the fetched data
export const fetch_save2 = async (table, setData) => {
  const data = await fetcher2(table); // Fetch data using the fetcher2 function
  if (data) {
    setData(data); // Update the state with the fetched data
  } else {
    setData(null); // Set data to null if fetching failed
    console.log(data);
    
  }
};

export const fetch_save3 = async (table, setData, docID) => {
  console.log(docID);

  const data = await fetcher3(table, docID); // Fetch data using the fetcher2 function
  if (data) {
    setData(data); // Update the state with the fetched data
  } else {
    console.log(data);
    setData(null); // Set data to null if fetching failed
  }
};

export const profile_fetch_save = async (table, setData) => {
  const data = await profile_fetch(table)
  if (data){
    setData(data)
  }else {
    setData(null)
  }
}

export const role_fetch_save = async (setData, update_doc) => {
  const data = await role_fetch(update_doc)
  if (data){
    setData(data)
  }else {
    setData(null)
  }
}

export const stat_fetch_save = async (table, setData) => {
  const data = await stat_fetcher(table); // Fetch data using the fetcher2 function
  if (data) {
    setData(data); // Update the state with the fetched data
  } else {
    setData(null); // Set data to null if fetching failed
  }
};

// Function to fetch documents and format them for a dropdown menu
export const fetch_dropdown = async (table, setData) => {
  try {
    const data = await fetcher(table); // Fetch data using the fetcher function
    const dropdownData = data.map((item) => ({
      label: item.name,  // Assuming 'name' is the field you want to use as the label
      value: item.name, // Assuming 'name' is the field you want to use as the value
    }));
    setData(dropdownData);
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    return []; // Return an empty array in case of an error
  }
};

export const approval_dropdown = async (table, setData) => {
  try {
    const data = await fetcher(table); // Fetch data using the fetcher function
    const dropdownData = data.map((item) => ({
      label: item.name,  // Assuming 'name' is the field you want to use as the label
      value: 'pending', // Assuming 'name' is the field you want to use as the value
    }));
    setData(dropdownData);
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to filter fetched data based on criteria
export const filter_fetch = async (table, criteria) => {
  const data = await fetcher(table);

  if (!data) {
    return [];
  }

  // Check if criteria is empty or all its values are empty
  const isCriteriaEmpty = !criteria || Object.values(criteria).every(value => value.trim() === '');

  if (isCriteriaEmpty) {
    // If no criteria provided, filter out admin users and return the rest
    return data.filter(user => !user.admin);
  }

  const filteredData = data.filter(item => {
    let matchesEmployeeName = true;
    let matchesEmployeeID = true;
    let matchesDesignation = true;

    if (criteria.employeeName && criteria.employeeName.trim() !== '') {
      matchesEmployeeName = item.username && typeof item.username === 'string' && item.username.toLowerCase().includes(criteria.employeeName.toLowerCase());
    }

    if (criteria.employeeId && criteria.employeeId.trim() !== '') {
      matchesEmployeeID = item.employeeID && typeof item.employeeID === 'string' && item.employeeID.toLowerCase().includes(criteria.employeeId.toLowerCase());
    }

    if (criteria.designation && criteria.designation.trim() !== '') {
      matchesDesignation = item.designation && typeof item.designation === 'string' && item.designation.toLowerCase() === criteria.designation.toLowerCase();
    }

    return matchesEmployeeName && matchesEmployeeID && matchesDesignation;
  });

  // Filter out admin users from the filtered results
  const nonAdminUsers = filteredData.filter(user => !user.admin);

  return nonAdminUsers;
};


// Function to filter fetched data and set the data state using the filtered data
export const filter_fetch_save = async (table, criteria, setData) => {
  const data = await filter_fetch(table, criteria); // Fetch data using the filter_fetch function
  setData(data); // Update the state with the filtered data
};