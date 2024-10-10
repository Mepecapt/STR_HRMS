import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { setDoc, doc, collection, updateDoc } from "firebase/firestore";
import db, { auth } from "../../firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {fetcher, fetch_dropdown, fetch_save, fetch_save2, current_user, fetch_save3} from "../../firebase_utils/fetchData"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailrgx } from "../../views/pages/Authentication/RegEx";
import { objs, update_objs } from "../../utils/empObj";

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
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required("Please repeat the password"),
});

const AllEmployeeAddPopup = ({ update_doc }) => {

  const [designation, setDesignation] = useState(null)
  const [department, setDepartment] = useState(null)
  const [change, setChange] = useState(null)
  const [roles, setRoles] = useState([])
  const [user, setUser] = useState([])
  const [curr_role, setCurrr_Role] = useState([])
  const [role_perm, setRolePerm] = useState([])
  const [curr_depart, setCurr_Depart] = useState(null)
  const [curr_desig, setCurr_Desig] = useState(null)
  const [updateUser, setUpdateUser] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      if(update_doc !== null){
        await fetch_save3('user', setUpdateUser, update_doc)
      }
    }

    fetchData()
    console.log(updateUser);
    
  }, [update_doc])

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm(
    { resolver: yupResolver(schema)},
    { defaultValues: curr_role }
  )
  const { 
    register: register2, 
    handleSubmit: handleSubmit2, 
    formState: { errors: errors2 }, 
    reset: reset2, 
    control: control2 
  } = useForm(
    { resolver: yupResolver(schema),
      defaultValues: {...updateUser,
        designation: {value: updateUser?.designation, label: updateUser?.designation},
        department: {value: updateUser?.department, label: updateUser?.department},
        company: {value: updateUser?.company, label: updateUser?.company},
      }
    }
  );

  useEffect(() => {
    if (updateUser) {
      reset2({
        ...updateUser,
        designation: { value: updateUser?.designation, label: updateUser?.designation },
        department: { value: updateUser?.department, label: updateUser?.department },
        company: { value: updateUser?.company, label: updateUser?.company },
      });
    }
  }, [updateUser, reset2]);

  // useEffect(() => {
  //   if (role_perm && curr_depart && curr_desig) {
  //     const current_role = role_perm.find(
  //       (perm) => perm.designation === curr_desig && perm.department === curr_depart
  //     );
  //     // if (current_role) {
  //     //   current_role.forEach((role) => {
  //     //     setValue(role.key, role); // Make sure role.key is the correct field name
  //     //   });
  //     // }
  //   }
  // }, [role_perm, curr_depart, curr_desig, setValue]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch_dropdown('designation', setDesignation);
        await fetch_dropdown('department', setDepartment);
        await fetch_save('roles', setRoles);  // Chain this call here
        await fetch_save('roles_permissions', setRolePerm)
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [change]);

  const document_id = current_user.uid

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch_save2('user', setUser, document_id)
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [change]);

  const companies = [
    { value: "Heterize Infotech Pvt Ltd", label: "Heterize Infotech Pvt Ltd" },
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

  const testSubmit = data => {
    console.log(data);
  }

  const onSubmit = async (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      // Signed up 
    const userID = userCredential.user.uid
    const userData = objs(userID, data, roles, selectedDate1)    
    
    async function saveUserData() {
      try {
        await Promise.all(
          userData.map(async (info) => {
            const docRef = info.ref;
            await setDoc(docRef, info.data);
          })
        );
        console.log("Success");
      } catch (error) {
        console.log(error);
      }
    }
    saveUserData();
    localStorage.setItem('toast', 'New Employee added')
    // window.location.href="/employees"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
    console.log(data)
  }

  const updateEmplo = (data) => {
    console.log('ghb', data, update_doc);
    
    const userData = update_objs(update_doc, data, roles, selectedDate1)
    console.log(userData)

    async function saveUserData() {
      try {
        await Promise.all(
          userData.map(async (info) => {
            const docRef = info.ref;
            await updateDoc(docRef, info.data);
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
    saveUserData();
    localStorage.setItem('toast', 'New Employee added')
    // window.location.href="/employees"
  };

  const [selectedDate1, setSelectedDate1] = useState(null);

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  const check_fields = [
    'read', 'write', 'create', 'delete', 'import', 'export'
  ]

  return (
    <>
      <div id="add_employee" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee</h5>
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
            <form onSubmit={handleSubmit(testSubmit)}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input className="form-control" type="text" name="fname" {...register("fname")}/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Last Name</label>
                      <input className="form-control" type="text" name="lname" {...register('lname')} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input className="form-control" type="text" name="username" {...register('username')}/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <span className="text-danger">{errors.email?.message}</span>
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input className="form-control" type="email" name="email" {...register('email')}/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <span className="text-danger">{errors.passoword?.message}</span>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Password</label>
                      <input className="form-control" type="password" {...register('password')}/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <span className="text-danger">{errors.confirm_password?.message}</span>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Confirm Password</label>
                      <input className="form-control" type="password" name="confirm_password" {...register('confirm_password')}/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" name="employeeID" {...register('employeeID')}/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          className="form-control floating datetimepicker"
                          type="date"
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Phone </label>
                      <input className="form-control" type="tel" name="phone" {...register('phone')} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Company</label>
                      <Controller
                        name="company"
                        control={control}
                        render={({ field: {onChange} }) => (
                          <Select
                            options={companies}
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
                        Department <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="department"
                        control={control}
                        render={({field: {onChange}}) => (
                          <Select
                            options={department}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);  // updates the form value
                              setCurr_Depart(selectedOption.value);  // updates the department state
                            }}
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
                            onChange={(selectedOption) => {
                              onChange(selectedOption);  // updates the form value
                              setCurr_Desig(selectedOption.value);  // updates the department state
                            }}
                          />
                          )}
                        />
                    </div>
                  </div>
                </div>
                <div className="table-responsive m-t-15">
                  <table className="table table-striped custom-table">
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th className="text-center">Read</th>
                        <th className="text-center">Write</th>
                        <th className="text-center">Create</th>
                        <th className="text-center">Delete</th>
                        <th className="text-center">Import</th>
                        <th className="text-center">Export</th>
                      </tr>
                    </thead>
                    <tbody>
{roles?.map((role, id) =>
  role.checked ? (
    <tr key={id}>
      <td>{role.role}</td>
      {check_fields.map((permission) => (
        <td className="text-center" key={permission}>
          <label className="custom_check">
            <input
              type="checkbox"
              name={`${role.role.toLowerCase()}_${permission}`}
              value={false}
              {...register(`${role.role.toLowerCase()}_${permission}`)}
              className="rememberme"
            />
            <span className="checkmark" />
          </label>
        </td>
      ))}
    </tr>
  ) : null
)}

                    </tbody>
                  </table>
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

      <div id="edit_employee" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Employee</h5>
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
              <form onSubmit={handleSubmit2(updateEmplo)}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        
                        type="text"
                        name="fname"
                        {...register2('fname')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Last Name</label>
                      <input
                        className="form-control"
                        
                        type="text"
                        name="lname"
                        {...register2('lname')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="username"
                        {...register2('username')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <span className="text-danger">{errors.email?.message}</span>
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        
                        type="email"
                        name="email"
                        {...register2('email')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <span className="text-danger">{errors.password?.message}</span>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        {...register2('password')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                  <span className="text-danger">{errors.confirm_password?.message}</span>
                    <div className="input-block mb-3">
                      <label className="col-form-label">Confirm Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name="confirm_password"
                        {...register2('confirm_password')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        readOnly=""
                        className="form-control floating"
                        name="employeeID"
                        {...register2('employeeID')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          className="form-control floating datetimepicker"
                          type="date"
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Phone </label>
                      <input
                        className="form-control"
                        
                        type="text"
                        name="phone"
                        {...register2('phone')}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-block mb-3">
                      <label className="col-form-label">Company</label>
                      <Controller
                        name="company"
                        control={control}
                        render={({ field: {onChange, value} }) => (
                          <Select
                            options={companies}
                            selectedOption={{ label: updateUser?.company, value: updateUser?.company }}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={onChange}
                            value={value}
                          />
                          )}
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
                        control={control2}
                        render={({ field: {onChange, value} }) => (
                          <Select
                            options={department}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={onChange}
                            value={value}
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
                        control={control2}
                        render={({ field: {onChange, value} }) => (
                          <Select
                            options={designation}
                            placeholder="Select"
                            styles={customStyles}
                            onChange={onChange}
                            value={value}
                          />
                          )}
                        />
                    </div>
                  </div>
                </div>
                <div className="table-responsive m-t-15">
                  <table className="table table-striped custom-table">
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th className="text-center">Read</th>
                        <th className="text-center">Write</th>
                        <th className="text-center">Create</th>
                        <th className="text-center">Delete</th>
                        <th className="text-center">Import</th>
                        <th className="text-center">Export</th>
                      </tr>
                    </thead>
                    <tbody>
                    {roles?.map((role, id) =>
  role.checked ? (
    <tr key={id}>
      <td>{role.role}</td>
      {check_fields.map((permission) => (
        <td className="text-center" key={permission}>
          <label className="custom_check">
            <input
              type="checkbox"
              name={`${role.role.toLowerCase()}_${permission}`}
              value={false}
              {...register2(`${role.role.toLowerCase()}_${permission}`)}
              className="rememberme"
            />
            <span className="checkmark" />
          </label>
        </td>
      ))}
    </tr>
  ) : null
)}
                    </tbody>
                  </table>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                  Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllEmployeeAddPopup;

