import React, { useEffect, useState } from "react";
import SearchBox from "../../../../components/SearchBox";
import { Table } from "antd";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import DeleteModal from "../../../../components/modelpopup/DeleteModal";
import LeaveTypeModal from "../../../../components/modelpopup/LeaveTypeModal";
import { fetch_save } from "../../../../firebase_utils/fetchData";
import { only_update } from "../../../../utils/funcs";

const LeaveType = () => {
  const [element_id, setElement_id] = useState(null)
  const [element_id2, setElement_id2] = useState(null)
  const [change, setChange] = useState(null)
  const [leave_types, setLeave_types] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      await fetch_save('leavetypes', setLeave_types)
    }

    fetchData()
  }, [change])

  console.log(leave_types);

  const leaves = leave_types.map((leave, key) => ({
    id: key,
    leavetype: leave.name,  // Access properties from the 'leave' object
    leavedays: leave.days
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text) => (
        <div className="ant-table-row ant-table-row-level-0 ">
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Leave Type",
      dataIndex: "leavetype",
      render: (text) => (
        <div className="ant-table-row ant-table-row-level-0 ">
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "Leave Days",
      dataIndex: "leavedays",
      render: (text) => (
        <div className="ant-table-row ant-table-row-level-0">
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.leavedays.length - b.leavedays.length,
    },
    {
      title: "Status",
      sorter: true,
      render: (text, record) => (
        <div className="ant-table-row ant-table-row-level-0 ">
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={
              only_update('leavetypes', {status: 'active'}, record.id)
            }
          >
            <i className="far fa-dot-circle text-success" /> Active
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link to="#" className="dropdown-item"
            onClick={
              only_update('leavetypes', {status: 'pending'}, record.id)
            }
            >
              <i className="far fa-dot-circle text-success"/> Pending
            </Link>
            <Link to="#" className="dropdown-item"
            onClick={
              only_update('leavetypes', {status: 'inactive'}, record.id)
            }
            >
              <i className="far fa-dot-circle text-danger" onClick={() => setActive('inactive')}/> Inactive
            </Link>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      sorter: true,
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
              data-bs-target="#edit_leavetype"
            >
              <i className="fa fa-pencil m-r-5" onClick={() => setElement_id(record.id)}/> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa fa-trash m-r-5" onClick={() => setElement_id2(record.id)}/> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Leave Type"
            title="Dashboard"
            subtitle="Leave Type"
            modal="#add_leavetype"
            name="Add Leave Type"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={leaves}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        <LeaveTypeModal document_id={element_id} />
        <DeleteModal document_id={element_id2} table="leave_types" name="Delete Leave Type" routeref='leave-type'/>
      </div>
    </>
  );
};

export default LeaveType;
