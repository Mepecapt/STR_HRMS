import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Applogo } from "../../../Routes/ImagePath";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { fetch_save, stat_fetch_save } from "../../../firebase_utils/fetchData";
import { auth } from "../../../firebase";
// Handling form submission
import Cookies from "js-cookie";


// Validation schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
});

const Login = () => {
  const [fireusers, setFireUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [eye, setEye] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetching admin data
  useEffect(() => {
    const getAdmin = async () => {
      await stat_fetch_save('user', setFireUser);
    };

    getAdmin();
  }, []);

  // Setting admin status
  useEffect(() => {
    if (fireusers) {
      const isAdmin = fireusers.some((user) => user.admin === true);
      localStorage.setItem('admin', isAdmin)
      setAdmin(isAdmin);
    }
  }, [fireusers]);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, data.email, data.password);
      })
      .then((userCredential) => {
        const user = userCredential.user;
        const fireuser = fireusers.find((fireuser) => fireuser.email === user.email);

        console.log(fireuser, admin, user, fireusers);
        if (fireuser) {
          if (!admin) {
            navigate("/profile");
          } else {
            navigate('/admin-dashboard');
          }
        } else {
          setEmailError("User not found, please try again.");
          console.log(fireuser, admin, user, fireusers);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setEmailError(errorMessage);
      });
  };

  const onEyeClick = () => {
    setEye(!eye);
  };

  return (
    <div>
      <div className="account-page">
        <div className="main-wrapper">
          <div className="account-content">
            <Link to="/job-list" className="btn btn-primary apply-btn">
              Apply Job
            </Link>
            <div className="container">
              <div className="account-logo">
                <Link to="/admin-dashboard">
                  <img src={Applogo} alt="Dreamguy's Technologies" />
                </Link>
              </div>
              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title">Login</h3>
                  <p className="account-subtitle">Access to our dashboard</p>
                  <div>
                    <span className="text-danger">{emailError}</span>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="input-block mb-4">
                        <label className="col-form-label">Email Address</label>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <input
                              className={`form-control ${errors?.email ? "error-input" : ""}`}
                              type="text"
                              {...field}
                              autoComplete="true"
                            />
                          )}
                        />
                        <span className="text-danger">{errors.email?.message}</span>
                      </div>
                      <div className="input-block mb-4">
                        <div className="row">
                          <div className="col">
                            <label className="col-form-label">Password</label>
                          </div>
                          <div className="col-auto">
                            <Link className="text-muted" to="/forgot-password">
                              Forgot password?
                            </Link>
                          </div>
                        </div>
                        <div style={{ position: "relative" }}>
                          <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                              <input
                                className={`form-control ${errors?.password ? "error-input" : ""}`}
                                type={eye ? "password" : "text"}
                                {...field}
                              />
                            )}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "5%",
                              top: "30%",
                            }}
                            onClick={onEyeClick}
                            className={`fa-solid ${eye ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </div>
                        <span className="text-danger">{errors.password?.message}</span>
                      </div>
                      <div className="input-block text-center">
                        <button className="btn btn-primary account-btn" type="submit">
                          Login
                        </button>
                      </div>
                    </form>
                    <div className="account-footer">
                      {!admin ? (
                        <p>
                          Don't have an account yet?{" "}
                          <Link to="/register">Register</Link>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
