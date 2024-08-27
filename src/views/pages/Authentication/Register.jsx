import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Applogo } from "../../../Routes/ImagePath";
import { emailrgx } from "../Authentication/RegEx";
import { collection, addDoc, getDocs } from "firebase/firestore";
import db, { auth } from "../../../firebase";
import Cookies from "js-cookie"
import { createUserWithEmailAndPassword } from "firebase/auth";

// Schema for validation using Yup
const schema = yup.object({
  email: yup
    .string()
    .matches(emailrgx, "Invalid email format")
    .required("Email is required")
    .trim(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required")
    .trim(),
  repeatpassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required("Please repeat the password"),
});

const Register = () => {
  const [passwordEye, setPasswordEye] = useState(true);
  const [repeatPasswordEye, setRepeatPasswordEye] = useState(true);
  const [checkUser, setCheckUser] = useState(true);
  const [admin, setAdmin] = useState([]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch admin data from Firestore
  const getAdmin = async () => {
    try {
      const adminCollection = collection(db, "admin");
      const adminSnapshot = await getDocs(adminCollection);
      const adminList = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmin(adminList);
    } catch (error) {
      console.error("Error fetching admin documents: ", error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const onSubmit = async (data) => {
    const existingUser = admin.find(user => user.email === data.email);

    console.log(existingUser);
    

    if (!existingUser) {
      try {
        await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            setCheckUser(true);
            // Optionally navigate to another page on successful registration
            navigate("/admin-dashboard");
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });

        setCheckUser(true);
        // Optionally navigate to another page on successful registration
        navigate("/admin-dashboard");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      setCheckUser(false);
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="account-content">
          <div className="container">
            <div className="account-logo">
              <Link to="/admin-dashboard">
                <img src={Applogo} alt="Dreamguy's Technologies" />
              </Link>
            </div>
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Register</h3>
                <p className="account-subtitle">Access to our dashboard</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Email</label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className={`form-control ${errors.email ? "error-input" : ""}`}
                          type="text"
                          value={value || ""}
                          onChange={onChange}
                          autoComplete="off"
                        />
                      )}
                    />
                    <span className="text-danger">{errors.email?.message}</span>
                    <span className="text-danger">{!checkUser ? "This email already exists" : ""}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Password</label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <div className="pass-group" style={{ position: "relative" }}>
                          <input
                            type={passwordEye ? "password" : "text"}
                            className={`form-control ${errors.password ? "error-input" : ""}`}
                            value={value || ""}
                            onChange={onChange}
                            autoComplete="off"
                          />
                          <span
                            style={{ position: "absolute", right: "5%", top: "30%" }}
                            onClick={() => setPasswordEye(!passwordEye)}
                            className={`fa toggle-password ${passwordEye ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </div>
                      )}
                    />
                    <span className="text-danger">{errors.password?.message}</span>
                  </div>
                  <div className="input-block mb-3">
                    <label className="col-form-label">Repeat Password</label>
                    <Controller
                      name="repeatpassword"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <div className="pass-group" style={{ position: "relative" }}>
                          <input
                            type={repeatPasswordEye ? "password" : "text"}
                            className={`form-control ${errors.repeatpassword ? "error-input" : ""}`}
                            value={value || ""}
                            onChange={onChange}
                            autoComplete="off"
                          />
                          <span
                            style={{ position: "absolute", right: "5%", top: "30%" }}
                            onClick={() => setRepeatPasswordEye(!repeatPasswordEye)}
                            className={`fa toggle-password ${repeatPasswordEye ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </div>
                      )}
                    />
                    <span className="text-danger">{errors.repeatpassword?.message}</span>
                  </div>
                  <div className="input-block text-center">
                    <button type="submit" className="btn btn-primary account-btn">
                      Register
                    </button>
                  </div>
                </form>
                <div className="account-footer">
                  <p>
                    Already have an account? <Link to="/">Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
