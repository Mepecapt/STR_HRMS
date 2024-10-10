/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { Avatar_02, Avatar_16 } from "../../../Routes/ImagePath";
import { Link } from "react-router-dom";
import ProfileTab from "./ProfileTab";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { current_user, fetch_save, fetch_save2, fetcher, profile_fetch, profile_fetch_save } from "../../../firebase_utils/fetchData";

const Profile = () => {
  const [user, setUser] = useState({
    username: ' ',
    fname: ' ',
    lname: ' ',

  })
  const [change, setChange] = useState([])
  const [personal_info, setPersonal_info] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      await fetch_save2('user', setUser);
      await profile_fetch_save('personal_info', setPersonal_info)
    };

    fetchData();
  }, [change]);
  
  const userData = {
    id: 1,
    username: "John Doe",
    department: "UI/UX Design Team",
    designation: "Web Designer",
    employeeId: "FT-0001",
    join_date: "1st Jan 2023",
    phone: "9876543210",
    email: "johndoe@example.com",
    birthday: "24th July",
    address: "1861 Bayonne Ave, Manchester Township, NJ, 08759",
    gender: "Male",
    reports_to: "Johny",
  };
  
  return (
    <>
            <div className="page-wrapper">
      <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Profile"
            title="Dashboard"
            subtitle="Profile"
            modal="#add_indicator"
            name="Add New"
          />
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img">
                        <Link to="#">
                          <img src={user?.profile_cover === '' ? Avatar_02 : user.profile_cover} alt="User Image" />
                        </Link>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left">
                            <h3 className="user-name m-t-0 mb-0">
                              {user ? user.username : ''}
                            </h3>
                            <h6 className="text-muted">{user ? user.department : ''}</h6>
                            <small className="text-muted">
                            {user ? user.department : ''}
                            </small>
                            <div className="staff-id">
                              Employee ID : {user ? user.employeeId : ''}
                            </div>
                            <div className="small doj text-muted">
                              Date of Join : {user && user.join_date ? JSON.parse(user.join_date) : ''}
                            </div>
                            <div className="staff-msg">
                              <Link className="btn btn-custom" to="/call/chat">
                                Send Message
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <div className="title">Phone:</div>
                              <div className="text">
                                <Link to={`tel:${user ? user.phone : ''}`}>
                                {user ? user.phone : ''}
                                </Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Email:</div>
                              <div className="text">
                                <Link to={`mailto:${user ? user.email : ''}`}>
                                  {user ? user.email : ''}
                                </Link>
                              </div>
                            </li>
                            <li>
                              <div className="title">Birthday:</div>
                              <div className="text">{personal_info ? personal_info.birthday : ''}</div>
                            </li>
                            <li>
                              <div className="title">Address:</div>
                              <div className="text">{personal_info.address || ''}</div>
                            </li>
                            <li>
                              <div className="title">Gender:</div>
                              <div className="text">{personal_info.gender || ''}</div>
                            </li>
                            <li>
                              <div className="title">Reports to: {personal_info.reports_to || ''}</div>
                              <div className="text">
                                {/* <div className="avatar-box">
                                  <div className="avatar avatar-xs">
                                    <img src={Avatar_16} alt="User Image" />
                                  </div>
                                </div> */}
                                <Link to="profile">
                                  {personal_info.reports_to || ''}
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="pro-edit">
                      <Link
                        data-bs-target="#profile_info"
                        data-bs-toggle="modal"
                        className="edit-icon"
                        to="#"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card tab-box">
            <div className="row user-tabs">
              <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                <ul className="nav nav-tabs nav-tabs-bottom">
                  <li className="nav-item">
                    <Link
                      to="#emp_profile"
                      data-bs-toggle="tab"
                      className="nav-link active"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="#emp_projects"
                      data-bs-toggle="tab"
                      className="nav-link"
                    >
                      Projects
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="#bank_statutory"
                      data-bs-toggle="tab"
                      className="nav-link"
                    >
                      Bank &amp; Statutory
                      <small className="text-danger ms-1">(Admin Only)</small>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="#emp_assets"
                      data-bs-toggle="tab"
                      className="nav-link"
                    >
                      Assets
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Profile Info Tab */}
          <ProfileTab />
        </div>
      </div>
    </>
  );
};

export default Profile;

