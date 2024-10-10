import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import AddDesingnationModelPopup from "../../../components/modelpopup/AddDesingnationModelPopup";
import SearchBox from "../../../components/SearchBox";
import { base_url } from "../../../base_urls";
import { fetch_save } from "../../../firebase_utils/fetchData";
import ShowToast from '../../../utils/ShowToast'

const Designation = () => {
  const [designation, setDesignation] = useState([])
  const [change, setChange] = useState(false); // Keep track of changes to refetch if needed
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null); // Track selected department ID
  const [selectedDepartmentId2, setSelectedDepartmentId2] = useState(null); // Track selected department ID


  useEffect(() => {
    const fetchData = async () => {
      await fetch_save('designation', setDesignation)
    };

    fetchData();
  }, [change]); 

  const userElements = designation.map((data, index) => ({
    key: index + 1,
    id: index + 1,
    designation: data.name,
    departmentId: data.id,
  }));
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      sorter: (a, b) => a.id.length - b.id.length,
      width: "10%",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: (a, b) => a.designation.length - b.designation.length,
      width: "40%",
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
              data-bs-target="#edit_designation"
              onClick={() => setSelectedDepartmentId(record.departmentId)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
              onClick={() => setSelectedDepartmentId2(record.departmentId)}
            >
              <i className="fa fa-trash m-r-5" /> Delete
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.length - b.length,
      width: "10%",
    },
  ];
  return (
    <div>
      <div className="page-wrapper">
        <ShowToast/>
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Designations"
            title="Dashboard"
            subtitle="Designations"
            modal="#add_designation"
            name="Add  Designation"
          />
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

      <AddDesingnationModelPopup document_id={selectedDepartmentId} data={designation}/>
      <DeleteModal document_id={selectedDepartmentId2} table="designation" name="Delete Designation" routeref='/designations'/>
    </div>
  );
};

export default Designation;
