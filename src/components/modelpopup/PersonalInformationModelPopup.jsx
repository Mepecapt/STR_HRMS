import React, { useEffect, useState } from "react";
import { Avatar_02 } from "../../Routes/ImagePath";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { current_user, fetch_dropdown, fetch_save, fetch_save2, profile_fetch_save } from "../../firebase_utils/fetchData";
import db, {storage} from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { v4 as uuid } from 'uuid'; // Import uuid to generate unique file names

const PersonalInformationModelPopup = () => {
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [designation, setDesignation] = useState(null)
  const [department, setDepartment] = useState(null)
  const [image, setImage] = useState()
  const [cover_url, setCoverURL] = useState()

  const [user_data, setUser_data] = useState({});
  const [personalinfo, setPersonal_info] = useState({});
  const [familyinfo, setFamily_info] = useState({});
  const [experienceinfo, setExperience] = useState({});
  const [emergencycontact, setEmergency_contact] = useState({});
  const [educationinfo, setEducation_info] = useState({});
  const [change, setChange] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch_save2('user', setUser_data);
        await profile_fetch_save('personal_info', setPersonal_info);
        await profile_fetch_save('emergency_contact', setEmergency_contact);
        await profile_fetch_save('family_info', setFamily_info);
        await profile_fetch_save('education_info', setEducation_info);
        await profile_fetch_save('experience', setExperience);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchData();
  }, [change]);

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };

  const toastifyError = (message) => {
    alert(message); // Replace with your toast notification method
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch_dropdown('department', setDepartment)
        await fetch_dropdown('designation', setDesignation)
      } catch (error) {
        console.log(error);
      }
    }

    fetchData()
  }, [])
  
  // console.log(user_data, personalinfo, familyinfo, educationinfo, experienceinfo, emergencycontact);

  const user = current_user()
  const userid = user.uid

  const updateData = async (table, data) => {
    console.log(data);

    try {
      const docRef = doc(db, 'user', userid, 'profile', userid, table, userid); // Reference to the document to update
      await updateDoc(docRef, data);
    } catch (error) {
      console.log(error);
    }
  }

  const updateUserData = async (data) => {
    console.log(data);

    try {
      const docRef = doc(db, 'user', userid); // Reference to the document to update
      await updateDoc(docRef, data);  
    } catch (error) {
      console.log(error);
    }
  }

  const {
    register,
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({ defaultValues: user_data })
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: {errors: errors2}
  } = useForm({ defaultValues: emergencycontact })
  const {
    register: register3,
    control: control3,
    handleSubmit: handleSubmit3,
    formState: {errors: errors3}
  } = useForm({ defaultValues: personalinfo })
  const {
    register: register4,
    handleSubmit: handleSubmit4,
    formState: {errors: errors4}
  } = useForm({ defaultValues: educationinfo })
  const {
    register: register5,
    handleSubmit: handleSubmit5,
    formState: {errors: errors5}
  } = useForm({ defaultValues: experienceinfo })
  const {
    register: register6,
    handleSubmit: handleSubmit6,
    formState: {errors: errors6}
  } = useForm({ defaultValues: familyinfo })

  const reporter = [
    { value: 2, label: "Wilmer Deluna" },
    { value: 3, label: "Lesley Grauer" },
    { value: 4, label: "Jeffery Lalor" },
  ];
  const status = [
    { value: 1, label: "Single" },
    { value: 2, label: "Married" },
  ];
  const gender = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
  ];
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };

  const onSubmit = (data) => {
    console.log(data);

    if (image){
      console.log('sfsf');
      
      const imageRef = storageRef(storage, `products/${uuid()}`); // Generate a unique file name

      uploadBytes(imageRef, image)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              setCoverURL(url)
              console.log(cover_url);
            })
            .catch((error) => {
              toastifyError(error.message);
            });
        })
        .catch((error) => {
          toastifyError(error.message);
      });
    }

    setTimeout(() => {
      const user = {
        fname: data.fname || user_data.fname,
        lname: data.lname || user_data.lname,
        phone: data.phone || user_data.phone,
        designation: data.designation?.value || user_data.designation,
        department: data.department?.value || user_data.deaprtment,
        profile_cover: cover_url,
      };
  
      const personal = {
        gender: data.gender?.label || personalinfo.gender,
        birthday: JSON.stringify(selectedDate1) || JSON.parse(personalinfo.period_from),
        address: data.address || personalinfo.address,
        state: data.state || personalinfo.state,
      }
  
      updateUserData(user)
      updateData('personal_info', personal)
    }, 500);
  }

  const emergencySubmit = (data) => {
    console.log(data);

    const emergency_contact = {
      primary_name: data.primary_name || emergencycontact.primary_name,
      primary_phone: data.primary_phone || emergencycontact.primary_phone,
      primary_relationship: data.primary_relationship || emergencycontact.primary_relationship,
      secondary_name: data.second_name || emergencycontact.secondary_name,
      secondary_phone: data.second_phone || emergencycontact.secondary_phone,
      secondary_relationship: data.second_relationship || emergencycontact.secondary_relationship
    };

    updateData('emergency_contact', emergency_contact)
  }
  const personalSubmit = (data) => {
    console.log(data);

    const personal_info = {
      children: data.children || personalinfo.children,
      marital_status: data.status.label || personalinfo.marital_status,
      nationality: data.nationality || personalinfo.nationality,
      passport_expiry: JSON.stringify(selectedDate1) || JSON.parse(personalinfo.passport_expiry),
      passport_no: data.passport_no || personalinfo.passport_no,
      phone: data.phone || personalinfo.phone,
      religion: data.religion || personalinfo.religion,
      spouse_job: data.spouse_job || personalinfo.spouse_job,
      birthday: data.birthday || personalinfo.birthday,
      reports_to: data.reports_to || personalinfo.reports_to,
      spouse_job: data.spouse_job || personalinfo.spouse_job,
    };

    updateData('personal_info', personal_info)
  }
  const educationSubmit = (data) => {
    console.log(data);

    const education_info = {
      completion_date: JSON.stringify(selectedDate1) || JSON.parse(educationinfo.completion_date),
      degree: data.degree || educationinfo.degree,
      grade: data.grade || educationinfo.grade,
      institute: data.institute || educationinfo.institute,
      start_date: JSON.stringify(selectedDate2) || JSON.parse(educationinfo.start_date),
      subject: data.subject || educationinfo.subject
    };

    updateData('education_info', education_info)
  }
  const experienceSubmit = (data) => {
    console.log(data);

    const experience = {
      company_name: data.company_name || experienceinfo.company_name,
      job_position: data.job_position || experienceinfo.job_position,
      location: data.location || experienceinfo.location,
      period_from: JSON.stringify(selectedDate1) || JSON.parse(experienceinfo.period_from),
      period_to: JSON.stringify(selectedDate2) || JSON.parse(experienceinfo.period_to)
    };

    updateData('experience', experience)
  }
  const familySubmit = (data) => {
    console.log(data);

    const family_info = {
      date_of_birth: JSON.stringify(selectedDate1) || JSON.parse(familyinfo.date_of_birth),
      name: data.name || familyinfo.name,
      phone: data.phone || familyinfo.phone,
      relationship: data.relationship || familyinfo.relationship
    };
    

    updateData('family_info', family_info)
  }

  return (
    <>
      <div id="profile_info" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Profile Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="profile-img-wrap edit-img">
                      <img
                        className="inline-block"
                        src={Avatar_02}
                        alt="user"
                      />
                      <div className="fileupload btn">
                        <span className="btn-text">edit</span>
                        <input className="upload"
                        label="Image"
                        placeholder="Choose image"
                        accept="image/png, image/jpeg"
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={user_data.fname}
                            {...register('fname')}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={user_data.lname}
                            {...register('lname')}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Birth Date</label>
                          <div>
                            <DatePicker
                              selected={selectedDate1}
                              onChange={handleDateChange1}
                              className="form-control floating datetimepicker"
                              type="date"
                              placeholderText="04/10/2023"
                              dateFormat="dd-MM-yyyy"
                              defaultValue={personalinfo.birthday}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3">
                          <label className="col-form-label">Gender</label>
                          <Controller
                        name="gender"
                        control={control}
                        render={({ field: {onChange} }) => (
                          <Select
                            options={gender}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={onChange}
                            defaultValue={personalinfo.gender}
                          />
                          )}
                        />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={personalinfo.address}
                        {...register('address')}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={personalinfo.state}
                        {...register('state')}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={personalinfo.country}
                        {...register('country')}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Pin Code</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={10523}
                        {...register('pin')}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={personalinfo.phone}
                        {...register('phone')}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="department"
                        control={control}
                        render={({ field: {onChange} }) => (
                          <Select
                            options={department}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={onChange}
                          />
                          )}
                        />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Designation <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="designation"
                        control={control}
                        render={({ field: {onChange} }) => (
                          <Select
                            options={designation}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={onChange}
                            defaultValue={user_data.designation}
                          />
                          )}
                        />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Reports To <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="reports_to"
                        control={control}
                        render={({ field: {onChange} }) => (
                          <Select
                            options={reporter}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={onChange}
                            defaultValue={personalinfo.reports_to}
                          />
                          )}
                        />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        id="emergency_contact_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Personal Information</h5>
              <button
              type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit2(emergencySubmit)}>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Primary Contact</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3">
                          <label className="col-form-label">
                            Name <span className="text-danger">*</span>
                          </label>  
                          <input type="text" defaultValue={emergencycontact.primary_name} className="form-control" {...register2('primary_name')}/>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3">
                          <label className="col-form-label">
                            Relationship <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" defaultValue={emergencycontact.primary_relationship} type="text" {...register2('primary_relationship')}/>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3">
                          <label className="col-form-label">
                            Phone <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" defaultValue={emergencycontact.primary_phone} type="text" {...register2('primary_phone')}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Secondary Contact</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3">
                          <label className="col-form-label">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input type="text" defaultValue={emergencycontact.secondary_name} className="form-control" {...register2('second_name')}/>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3">
                          <label className="col-form-label">
                            Relationship <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" defaultValue={emergencycontact.secondary_relationship} type="text" {...register2('second_relationship')}/>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block mb-3 mb-3">
                          <label className="col-form-label">
                            Phone <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" defaultValue={emergencycontact.secondary_phone} type="text" {...register2('second_phone')}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Modal */}
      <div
        id="personal_info_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Personal Information</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit3(personalSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">Passport No</label>
                      <input type="text" defaultValue={personalinfo.passport_no} className="form-control" {...register3('passport_no')}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">
                        Passport Expiry Date
                      </label>
                      <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          className="form-control floating datetimepicker"
                          type="date"
                          defaultValue={personalinfo.passport_expiry}
                          placeholderText="04/10/2023"
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">Tel</label>
                      <input className="form-control" defaultValue={personalinfo.phone} type="text" {...register3('phone')}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">
                        Nationality <span className="text-danger">*</span>
                      </label>
                      <input className="form-control" defaultValue={personalinfo.nationality} type="text" {...register3('nationality')}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">Religion</label>
                      <div className="cal-icon">
                        <input className="form-control" defaultValue={personalinfo.religion} type="text" {...register3('religion')}/>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">
                        Marital status <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="status"
                        control={control3}
                        render={({ field: {onChange} }) => (
                          <Select
                            options={status}
                            placeholder="Select"
                            styles={customStyles}
                            defaultValue={personalinfo.marital_status}
                            onChange={onChange}
                          />
                          )}
                        />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">
                        Employment of spouse
                      </label>
                      <input className="form-control" defaultValue={personalinfo.spouse_job} type="text" {...register3('spouse_job')}/>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block mb-3 mb-3">
                      <label className="col-form-label">No. of children </label>
                      <input className="form-control" defaultValue={personalinfo.children} type="text" {...register3('children')}/>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Personal Info Modal */}

      {/* Education Modal */}
      <div
        id="education_info"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"> Education Informations</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit4(educationSubmit)}>
                <div className="form-scroll">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">
                        Education Informations{" "}
                        <Link to="#" className="delete-icon">
                          <i className="fa-regular fa-trash-can" />
                        </Link>
                      </h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <input
                              type="text"
                              defaultValue={personalinfo.institute}
                              className="form-control floating"
                              {...register4('institution')}
                            />
                            <label className="focus-label">Institution</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <input
                              type="text"
                              defaultValue={personalinfo.subject}
                              className="form-control floating"
                              {...register4('subject')}
                            />
                            <label className="focus-label">Subject</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <div className="cal-icon">
                              <DatePicker
                                selected={selectedDate1}
                                onChange={handleDateChange1}
                                defaultValue={personalinfo.start_date}
                                className="form-control floating datetimepicker"
                                type="date"
                                placeholderText="04/10/2023"
                                dateFormat="dd-MM-yyyy"
                              />
                            </div>
                            <label className="focus-label">Starting Date</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <div className="cal-icon">
                              <DatePicker
                                selected={selectedDate2}
                                onChange={handleDateChange2}
                                className="form-control floating datetimepicker"
                                type="date"
                                defaultValue={personalinfo.completion_date}
                                placeholderText="04/10/2023"
                                dateFormat="dd-MM-yyyy"
                              />
                            </div>
                            <label className="focus-label">Complete Date</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <input
                              type="text"
                              defaultValue="BE Computer Science"
                              className="form-control floating"
                              {...register4('degree')}
                            />
                            <label className="focus-label">Degree</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <input
                              type="text"
                              defaultValue={personalinfo.degree}
                              className="form-control floating"
                              {...register4('grade')}
                            />
                            <label className="focus-label">Grade</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Education Modal */}

      {/* Experience Modal */}
      <div
        id="experience_info"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Experience Informations</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit5(experienceSubmit)}>
                <div className="form-scroll">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">
                        Experience Informations{" "}
                        <Link to="#" className="delete-icon">
                          <i className="fa-regular fa-trash-can" />
                        </Link>
                      </h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <input
                              type="text"
                              className="form-control floating"
                              defaultValue={experienceinfo.company_name}
                              {...register5('company_name')}
                            />
                            <label className="focus-label">Company Name</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <input
                              type="text"
                              className="form-control floating"
                              defaultValue={experienceinfo.location}
                              {...register5('location')}
                            />
                            <label className="focus-label">Location</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <input
                              type="text"
                              className="form-control floating"
                              defaultValue={experienceinfo.job_position}
                              {...register5('job_position')}
                            />
                            <label className="focus-label">Job Position</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <div className="cal-icon">
                              <DatePicker
                                selected={selectedDate1}
                                onChange={handleDateChange1}
                                className="form-control floating datetimepicker"
                                type="date"
                                defaultValue={experienceinfo.period_from}
                                placeholderText="04/10/2023"
                                dateFormat="dd-MM-yyyy"
                              />
                            </div>
                            <label className="focus-label">Period From</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3 form-focus focused">
                            <div className="cal-icon">
                              <DatePicker
                                selected={selectedDate2}
                                onChange={handleDateChange2}
                                className="form-control floating datetimepicker"
                                defaultValue={experienceinfo.period_to}
                                type="date"
                                placeholderText="04/10/2023"
                                dateFormat="dd-MM-yyyy"
                              />
                            </div>
                            <label className="focus-label">Period To</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Experience Modal */}

      {/* Family Info Modal */}
      <div
        id="family_info_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"> Family Informations</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit6(familySubmit)}>
                <div className="form-scroll">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">
                        Family Member{" "}
                        <Link to="#" className="delete-icon">
                          <i className="fa-regular fa-trash-can" />
                        </Link>
                      </h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3">
                            <label className="col-form-label">
                              Name <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" defaultValue={familyinfo.name} type="text" {...register6('name')}/>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3">
                            <label className="col-form-label">
                              Relationship{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" defaultValue={familyinfo.relationship} type="text" {...register6('relationship')}/>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3">
                            <label className="col-form-label">
                              Date of birth{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                                selected={selectedDate1}
                                onChange={handleDateChange1}
                                defaultValue={familyinfo.date_of_birth}
                                className="form-control floating datetimepicker"
                                type="date"
                                placeholderText="04/10/2023"
                                dateFormat="dd-MM-yyyy"
                              />                          
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block mb-3 mb-3">
                            <label className="col-form-label">
                              Phone <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" defaultValue={familyinfo.phone} type="text" {...register6('phone')}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Family Info Modal */}
    </>
  );
};

export default PersonalInformationModelPopup;
