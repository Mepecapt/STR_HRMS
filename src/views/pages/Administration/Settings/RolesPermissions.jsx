import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { fetch_dropdown, fetch_save } from "../../../../firebase_utils/fetchData";
import db from "../../../../firebase"; // Make sure to correctly import your Firebase instance
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import ShowToast from "../../../../utils/ShowToast";
import { useForm, Controller } from "react-hook-form";
import { Select } from "antd";
import RolesPermissionsModal from "../../../../components/modelpopup/RolesPermissionsModal";
import { User } from "react-feather";
import { modal_adder, modal_updater, only_update } from "../../../../utils/funcs";

const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [element_id, setElement_id] = useState(null)
  const [element_id2, setElement_id2] = useState(null)
  const [designation, setDesignation] = useState([])
  const [isActive, setIsActive] = useState(0)
  const [department, setDepartment] = useState([])
  const [departdrop, setDepartDrop] = useState([])
  const [role_perm, setRolePerm] = useState([])
  const [role_permission, setRolePermission] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const { handleSubmit, register, control, setValue } = useForm()

  const handleDepartmentChange = value => {
    setSelectedDepartment(value)
    console.log(value);
  }

  useEffect(() => {
    const current_permissions = role_permission.find(data => ((data.department === selectedDepartment) && data.designation === designation[isActive].name))
    setRolePerm(current_permissions)
  
    if (current_permissions !== undefined && current_permissions !== null){
      for (const [key, value] of Object.entries(current_permissions)) {
        setValue(key, value)
      }
    }

  }, [selectedDepartment, isActive])

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch_save("roles", setRoles);
        await fetch_save('department', setDepartment)
        await fetch_save("designation", setDesignation)
        await fetch_save('roles_permissions', setRolePermission)
        await fetch_dropdown('department', setDepartDrop)
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Function to handle checkbox state change and update Firestore
  const handleCheckboxChange = async (index) => {
    const updatedRoles = roles.map((role, i) =>
      i === index ? { ...role, checked: !role.checked } : role
    );

    setRoles(updatedRoles);

    // Update Firestore document
    const roleToUpdate = updatedRoles[index];
    only_update('roles', roleToUpdate, roleToUpdate.id)

    // const roleDocRef = doc(db, "roles", roleToUpdate.id); // Use the correct Firestore path and role ID

    // try {
    //   await updateDoc(roleDocRef, {...roleToUpdate, checked: roleToUpdate.checked });
    //   console.log(`Role ${roleToUpdate.name} updated successfully in Firestore`);
    // } catch (error) {
    //   console.error("Error updating Firestore document: ", error);
    // }
  };

  const table_data = roles.map((role, id) => {
    return {
      category: role.role,
      items: ['read', 'write', 'update', 'delete', 'import', 'export']
    }
  })


  const role_types = designation.map((desig) => desig.name);  

  const onSubmit = (data) => {
    console.log(data);

    const departmentExists = role_permission.some(item => item.department === data.department)
    const designationExists = role_permission.some(item => item.designation === data.designation)

    const input_data = {
      ...data,
      department: selectedDepartment,
      designation: designation[isActive].name,
    }

    if(departmentExists && designationExists){
      const existDepartment = role_perm.find(item => item.department === data.department);
      modal_updater('roles_permissions', input_data, '/roles-permissions', existDepartment)
    }else{
      modal_adder('roles_permissions', input_data, '/roles-permissions')
    }
  }
  return (
    <>
      <div className="page-wrapper">
        <ShowToast/>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs 
            maintitle="Roles & Permissions"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-3">
              <Link
                to="#"
                className="btn btn-primary btn-block w-100"
                data-bs-toggle="modal"
                data-bs-target="#add_role"
              >
                <i className="fa fa-plus" /> Add Roles
              </Link>
              <div className="roles-menu">
                <ul>
                  {role_types.map((role, index) => (
                    <li key={index} className={index == isActive ? "active" : ""}>
                      <Link to="#" onClick={() => setIsActive(index)}>
                        {role}
                        <span className="role-action">
                          <span
                            className="action-circle large me-1"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                          >
                            <i className="material-icons">edit</i>
                          </span>
                          <span
                            className="action-circle large delete-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#delete"
                          >
                            <i className="material-icons">delete</i>
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Select
                className="w-full"
                options={departdrop}
                placeholder="Select Department"
                styles={customStyles}
                onChange={handleDepartmentChange} // Update state on change
              />
            </div>
            <div className="col-sm-8 col-md-8 col-lg-8 col-xl-9">
              <h6 className="card-title m-b-20">Module Access</h6>
              <div className="m-b-30">
                <ul className="list-group notification-list">
                  {roles.map((role, index) => (
                    <li key={role.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>{role.role}</div>
                    <div className="d-flex align-items-center">
                      <div className="status-toggle me-2">
                        <input
                          type="checkbox"
                          id={`role_${role.id}`}
                          className="check"
                          checked={role.checked || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                        <label htmlFor={`role_${role.id}`} className="checktoggle">
                          checkbox
                        </label>
                      </div>
                      <div className="dropdown dropdown-action text-end">
                        <Link
                          to="#"
                          className="action-icon dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="material-icons">more_vert</i>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link
                            className="dropdown-item"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_role"
                            onClick={() => setElement_id(role.departmentId)}
                          >
                            <i className="fa fa-pencil m-r-5" /> Edit
                          </Link>
                          <Link
                            className="dropdown-item"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete"
                            onClick={() => setElement_id2(role.departmentId)}
                          >
                            <i className="fa fa-trash  m-r-5" /> Delete
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  ))}
                </ul>
              </div>
              <div className="table-responsive">
              <form onSubmit={handleSubmit(onSubmit)}>
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
                    {table_data.map((categoryData, index) => (
                      <tr key={index}>
                        <td>{categoryData.category}</td>
                        {categoryData.items.map((item, itemIndex) => (
                          <td key={itemIndex} className="text-center">
                            <label className="custom_check">
                              <input type="checkbox" {...register(`${categoryData.category.toLowerCase()}_${item}`)} className="rememberme"/>
                              <span className="checkmark" />
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <div className="text-center">
                  <button
                    className="btn btn-primary btn-block w-100"
                    type="submit"
                  >
                    Save Changes
                  </button>
                  </div>
                </table>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <RolesPermissionsModal documentID={element_id} />
        <DeleteModal document_id={element_id2} table='roles' name="Role Delete"  routeref='roles-permissions'/>
      </div>
    </>
  );
};

export default RolesPermissions;
