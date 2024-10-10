import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar_02
} from "../../../Routes/ImagePath";
import AllEmployeeAddPopup from "../../../components/modelpopup/AllEmployeeAddPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import EmployeeListFilter from "../../../components/EmployeeListFilter";
import { filter_fetch_save } from "../../../firebase_utils/fetchData";
import { useEffect, useState } from "react";
import ShowToast from '../../../utils/ShowToast'

const AllEmployee = () => {
  const [personalData, setPersonalData] = useState([])
  const [criteria, setCriteria] = useState([])
  const [elementId, setElementID] = useState([])
  const [elementId2, setElementID2] = useState([])
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await filter_fetch_save('user', criteria, setPersonalData);
      } catch (error) {
        console.log(error); 
      }
    };

    fetchData();
  }, [criteria]); // Add dependencies if needed
  
  return (
    <div>
      <div className="page-wrapper">
        <ShowToast/>
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Employee"
            title="Dashboard"
            subtitle="Employee"
            modal="#add_employee"
            name="Add Employee"
            Linkname="/employees"
            Linkname1="/employees-list"
          />
           <EmployeeListFilter setCriteria={setCriteria}/>

          <div className="row">
            {personalData.map((employee) => (
                            <div
                            className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3"
                            key={employee.id}
                          >
                            <div className="profile-widget">
                              <div className="profile-img">
                                <Link to="/profile" className="avatar">
                                  <img src={employee.profile_cover || Avatar_02} alt="" />
                                </Link>
                              </div>
                              <div className="dropdown profile-action">
                                <Link
                                  to="#"
                                  className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="material-icons">more_vert</i>
                                </Link>
                                <div className="dropdown-menu dropdown-menu-right" >
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_employee"
                                    onClick={() => setElementID(employee.id)}
                                  >
                                    <i className="fa fa-pencil m-r-5" /> Edit
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete"
                                    onClick={() => setElementID2(employee.id)}
                                  >
                                    <i className="fa-regular fa-trash-can m-r-5" /> Delete
                                  </Link>
                                </div>
                              </div>
                              <h4 className="user-name m-t-10 mb-0 text-ellipsis">
                                <Link to={`/profile/${employee.id}`}>{employee.username}</Link>
                              </h4>
                              <div className="small text-muted">{employee.designation}</div>
                            </div>
                          </div>
            ))}
          </div>
        </div>
      </div>
      <AllEmployeeAddPopup update_doc={elementId}/>
      {/* Delete Modal */}
      <DeleteModal document_id={elementId2} table="user" name="Delete Employee" routeref='/employees'/>
      {/* Delete Modal */}
    </div>
  );
};

export default AllEmployee;


