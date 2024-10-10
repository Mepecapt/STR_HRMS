import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PersonalInformationModelPopup from "../../../components/modelpopup/PersonalInformationModelPopup";
import { ListItem, ProjectDetails } from "./ProfileContent";
import { current_user, profile_fetch_save } from "../../../firebase_utils/fetchData";

const ProfileTab = () => {
  const [personal_info, setPersonal_info] = useState({});
  const [family_info, setFamily_info] = useState({});
  const [experience, setExperience] = useState({});
  const [emergency_contact, setEmergency_contact] = useState({});
  const [education_info, setEducation_info] = useState({});
  const [bank_info, setBank_info] = useState({});

  const userid = current_user.uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await profile_fetch_save('personal_info', setPersonal_info);
        await profile_fetch_save('emergency_contact', setEmergency_contact);
        await profile_fetch_save('family_info', setFamily_info);
        await profile_fetch_save('education_info', setEducation_info);
        await profile_fetch_save('experience', setExperience);
        await profile_fetch_save('bank_info', setBank_info);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchData();
  }, [userid]);

  const personalInfoData = [
    { id: 1, title: "Passport No.", text: personal_info.passport_no || '' },
    { id: 2, title: "Passport Exp Date.", text: personal_info.passport_expiry ? JSON.parse(personal_info.passport_expiry) : '' },
    { id: 3, title: "Tel", text: personal_info.phone || '' },
    { id: 4, title: "Nationality", text: personal_info.nationality || '' },
    { id: 5, title: "Religion", text: personal_info.religion || '' },
    { id: 6, title: "Marital status", text: personal_info.marital_status || '' },
    { id: 7, title: "Employment of spouse", text: personal_info.spouse_job || '' },
    { id: 8, title: "No. of children", text: personal_info.children || '' }
  ];

  const primaryContactData = [
    { id: 1, title: "Name", text: emergency_contact.primary_name || '' },
    { id: 2, title: "Relationship", text: emergency_contact.primary_relationship || '' },
    { id: 3, title: "Phone", text: emergency_contact.primary_phone || '' },
  ];

  const secondaryContactData = [
    { id: 1, title: "Name", text: emergency_contact.secondary_name || '' },
    { id: 2, title: "Relationship", text: emergency_contact.secondary_relationship || '' },
    { id: 3, title: "Phone", text: emergency_contact.secondary_phone || '' },
  ];

  const bankInfoData = [
    { id: 1, title: "Bank name", text: bank_info.bank_name || '' },
    { id: 2, title: "Bank account No.", text: bank_info.bank_account || '' },
    { id: 3, title: "IFSC Code", text: bank_info.ifsc_code || '' },
    { id: 4, title: "PAN No", text: bank_info.pan_no || '' },
  ];

  const familyInfoData = {
    name: family_info.name || '',
    relationship: family_info.relationship || '',
    dob: family_info.date_of_birth ? JSON.parse(family_info.date_of_birth) : '',  // Add this check
    phone: family_info.phone || ''
  };

  const educationData = {
    id: 1,
    name: education_info.institute || '',
    description: education_info.degree || '',
    time: (education_info.start_date && education_info.completion_date) 
            ? `${JSON.parse(education_info.start_date)} - ${JSON.parse(education_info.completion_date)}` 
            : ''  // Check for both start and completion dates
  };

  const experienceData = {
    id: 1,
    name: `${experience.job_position || ''} at ${experience.company_name || ''}`,
    time: (experience.period_from && experience.period_to)
            ? `${JSON.parse(experience.period_from)} - ${JSON.parse(experience.period_to)}`
            : ''  // Check for both period_from and period_to
  };
  
  return (
    <>
      <div className="tab-content">
        <div
          id="emp_profile"
          className="pro-overview tab-pane fade show active"
        >
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="card profile-box flex-fill">
                <div className="card-body">
                  <h3 className="card-title">
                    Personal Informations{" "}
                    <Link
                      to="#"
                      className="edit-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#personal_info_modal"
                    >
                      <i className="fa fa-pencil" />
                    </Link>
                  </h3>
                  <ul className="personal-info">
                    {personalInfoData.map((item) => (
                      <ListItem
                        id={item.id}
                        key={item.id}
                        title={item.title}
                        text={item.text}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex">
              <div className="card profile-box flex-fill">
                <div className="card-body">
                  <h3 className="card-title">
                    Emergency Contact{" "}
                    <Link
                      to="#"
                      className="edit-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#emergency_contact_modal"
                    >
                      <i className="fa fa-pencil" />
                    </Link>
                  </h3>
                  <h5 className="section-title">Primary</h5>
                  <ul className="personal-info">
                    {primaryContactData.map((item) => (
                      <ListItem
                        id={item.id}
                        key={item.id}
                        title={item.title}
                        text={item.text}
                      />
                    ))}
                  </ul>
                  <hr />
                  <h5 className="section-title">Secondary</h5>
                  <ul className="personal-info">
                    {secondaryContactData.map((item) => (
                      <ListItem
                        id={item.id}
                        key={item.id}
                        title={item.title}
                        text={item.text}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="card profile-box flex-fill">
                <div className="card-body">
                  <h3 className="card-title">Bank information</h3>
                  <ul className="personal-info">
                    {bankInfoData.map((item) => (
                      <ListItem
                        id={item.id}
                        key={item.id}
                        title={item.title}
                        text={item.text}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex">
              <div className="card profile-box flex-fill">
                <div className="card-body">
                  <h3 className="card-title">
                    Family Informations{" "}
                    <Link
                      to="#"
                      className="edit-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#family_info_modal"
                    >
                      <i className="fa fa-pencil" />
                    </Link>
                  </h3>
                  <div className="table-responsive">
                    <table className="table table-nowrap">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Relationship</th>
                          <th>Date of Birth</th>
                          <th>Phone</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{familyInfoData.name}</td>
                          <td>{familyInfoData.relationship}</td>
                          <td>{familyInfoData.dob}</td>
                          <td>{familyInfoData.phone}</td>
                          <td className="text-end">
                            <div className="dropdown dropdown-action">
                              <Link
                                aria-expanded="false"
                                data-bs-toggle="dropdown"
                                className="action-icon dropdown-toggle"
                                to="#"
                              >
                                <i className="material-icons">more_vert</i>
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link to="#" className="dropdown-item">
                                  <i className="fa fa-pencil m-r-5" /> Edit
                                </Link>
                                <Link to="#" className="dropdown-item">
                                  <i className="fa fa-trash m-r-5" /> Delete
                                </Link>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="card profile-box flex-fill">
                <div className="card-body">
                  <h3 className="card-title">Education</h3>
                  <Link
                      to="#"
                      className="edit-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#education_info"
                    >
                      <i className="fa fa-pencil" />
                    </Link>
                  <div className="table-responsive">
                    <table className="table table-nowrap">
                      <thead>
                        <tr>
                          <th>Institute Name</th>
                          <th>Degree</th>
                          <th>Time</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{educationData.name}</td>
                          <td>{educationData.description}</td>
                          <td>{educationData.time}</td>
                          <td className="text-end">
                            <div className="dropdown dropdown-action">
                              <Link
                                aria-expanded="false"
                                data-bs-toggle="dropdown"
                                className="action-icon dropdown-toggle"
                                to="#"
                              >
                                <i className="material-icons">more_vert</i>
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link to="#" className="dropdown-item">
                                  <i className="fa fa-pencil m-r-5" /> Edit
                                </Link>
                                <Link to="#" className="dropdown-item">
                                  <i className="fa fa-trash m-r-5" /> Delete
                                </Link>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex">
              <div className="card profile-box flex-fill">
                <div className="card-body">
                  <h3 className="card-title">Experience</h3>
                  <Link
                      to="#"
                      className="edit-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#experience_info"
                    >
                      <i className="fa fa-pencil" />
                    </Link>
                  <div className="table-responsive">
                    <table className="table table-nowrap">
                      <thead>
                        <tr>
                          <th>Job Title</th>
                          <th>Company Name</th>
                          <th>Time</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{experienceData.name}</td>
                          <td>{experienceData.company_name}</td>
                          <td>{experienceData.time}</td>
                          <td className="text-end">
                            <div className="dropdown dropdown-action">
                              <Link
                                aria-expanded="false"
                                data-bs-toggle="dropdown"
                                className="action-icon dropdown-toggle"
                                to="#"
                              >
                                <i className="material-icons">more_vert</i>
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link to="#" className="dropdown-item">
                                  <i className="fa fa-pencil m-r-5" /> Edit
                                </Link>
                                <Link to="#" className="dropdown-item">
                                  <i className="fa fa-trash m-r-5" /> Delete
                                </Link>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PersonalInformationModelPopup />
      {/* Add other modals similarly */}
    </>
  );
};

export default ProfileTab;
