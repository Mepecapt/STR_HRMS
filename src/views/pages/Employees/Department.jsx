import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import SearchBox from "../../../components/SearchBox";
import DepartmentModal from "../../../components/modelpopup/DepartmentModal";
import { fetch_save } from "../../../firebase_utils/fetchData";
import ShowToast from "../../../utils/ShowToast";

const Department = () => {
  const [department, setDepartment] = useState([]);
  const [change, setChange] = useState(false); // Keep track of changes to refetch if needed
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null); // Track selected department ID
  const [selectedDepartmentId2, setSelectedDepartmentId2] = useState(null); // Track selected department ID

  useEffect(() => {
    const fetchData = async () => {
      await fetch_save('department', setDepartment);
    };

    fetchData();
  }, [change]); 

  // Map the fetched department data to create table rows
  const userElements = department.map((dept, index) => ({
    key: index + 1,
    id: index + 1,
    department: dept.name,
    departmentId: dept.id, // Ensure the actual department ID from your data source is used
  }));

  console.log(userElements);
  

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Department Name",
      dataIndex: "department",
      sorter: (a, b) => a.department.length - b.department.length,
      width: "80%",
    },
    {
      title: "Action",
      className: "text-end",
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
              data-bs-target="#edit_department"
              onClick={() => setSelectedDepartmentId(record.departmentId)}
             >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
              onClick={() => setSelectedDepartmentId2(record.departmentId)} // Set selected department ID for delete
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
      width: "10%",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <ShowToast/>
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Department"
            title="Dashboard"
            subtitle="Department"
            modal="#add_department"
            name="Add Department"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={userElements?.length > 0 ? userElements : []}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pass the selected ID to the modals */}
      <DepartmentModal document_id={selectedDepartmentId} data={department}/>
      <DeleteModal document_id={selectedDepartmentId2} table="department" name="Delete Department" routeref='/departments'/>
    </>
  );
};

export default Department;
