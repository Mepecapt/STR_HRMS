import React, { useState } from "react";
import {
  Avatar_02,
  Avatar_05,
  Avatar_09,
  Avatar_10,
  Avatar_11,
  Avatar_12,
  Avatar_13,
} from "../../../Routes/ImagePath";
import { Link } from "react-router-dom";
import { Table } from "antd";
import EmployeeListFilter from "../../../components/EmployeeListFilter";
import Breadcrumbs from "../../../components/Breadcrumbs";
import AllEmployeeAddPopup from "../../../components/modelpopup/AllEmployeeAddPopup";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import SearchBox from "../../../components/SearchBox";
import { useEffect } from "react";
import { filter_fetch_save } from "../../../firebase_utils/fetchData";
import ShowToast from "../../../utils/ShowToast";

const EmployeeList = () => {
  const [criteria, setCriteria] = useState(null)
  const [personalData, setPersonalData] = useState([])
  const [elementId, setElementID] = useState(null)
  const [elementId2, setElementID2] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await filter_fetch_save('user', criteria, setPersonalData);
      } catch (error) {
        console.log(error); 
      }
    };

    fetchData();
    console.log('hello', personalData);
  }, [criteria]); // Add dependencies if needed


  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      render: (text, record) => (
        <span className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={Avatar_02} />
          </Link>
          <Link to="/profile">
            <span>{record.username}</span>
          </Link>
        </span>
      ),
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      sorter: (a, b) => a.employeeID.length - b.employeeID.length,
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },

    {
      title: "Mobile",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Join Date",
      dataIndex: "join_date",
      sorter: (a, b) => a.join_date.length - b.join_date.length,
    },
    {
      title: "Role",
      sorter: true,
      render: (text, record) => (
        <div className="dropdown">
          <Link
            to="#"
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
           {record.designation}
          </Link>
          <div className="dropdown-menu">
            {/* <Link className="dropdown-item" to="#">
              Software Engineer
            </Link>
            <Link className="dropdown-item" to="#">
              Software Tester
            </Link>
            <Link className="dropdown-item" to="#">
              Frontend Developer
            </Link>
            <Link className="dropdown-item" to="#">
              UI/UX Developer
            </Link> */}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      sorter: true,
      render: (text, record) => (
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
              data-bs-target="#edit_employee"
            >
              <i className="fa fa-pencil m-r-5" onClick={() => setElementID(record.id)}/> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_employee"
            >
              <i className="fa fa-trash m-r-5" onClick={() => setElementID2(record.id)}/>  Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="page-wrapper">
        <ShowToast/>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Employee"
            title="Dashboard"
            subtitle="Employee"
            modal="#add_employee"
            name="Add Employee"
            Linkname="/employees"
            Linkname1="/employees-list"
          />
          {/* /Page Header */}
          <EmployeeListFilter setCriteria={setCriteria}/>
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  className="table-striped"
                  columns={columns}
                  dataSource={personalData}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <AllEmployeeAddPopup document_id={elementId}/>
        <DeleteModal document_id={elementId2} table='user' name="Delete Employee" />
      </div>
    </div>
  );
};

export default EmployeeList;
