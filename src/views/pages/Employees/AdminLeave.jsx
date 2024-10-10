/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import {
  Avatar_01,
} from "../../../Routes/ImagePath";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { AdminLeaveAddModelPopup } from "../../../components/modelpopup/AdminLeaveModelPopup";
import SearchBox from "../../../components/SearchBox";
import LeaveFilter from "../../../components/LeaveFilter";
import { fetch_save } from "../../../firebase_utils/fetchData";
import ShowToast from "../../../utils/ShowToast"
import { modal_updater } from "../../../utils/funcs";

const AdminLeave = () => {
  const [select_id, setSelect_id] = useState(null)
  const [select_id2, setSelect_id2] = useState(null)
  const [change, setChange] = useState(null)
  const [leaves, setLeaves] = useState([])

  const updateStat = (id, status) => {
    const prev_data = leaves.find(leave => leave.id === id)
    console.log(status);
    
    modal_updater('leaves', {...prev_data, status: {...prev_data.status, stat: status}}, '/adminleaves', id)

    setChange(change => !change)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetch_save('leaves', setLeaves)
    }
    fetchData()
  }, [change])

  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      render: (text, record) => (
        <span className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <span className="table-avatar">
            <Link to="#" className="avatar"></Link>
            {text}
          </span>
        </span>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "Leave Type",
      dataIndex: "leavetype",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "From",
      dataIndex: "from",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.from.length - b.from.length,
    },
    {
      title: "To",
      dataIndex: "to",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.to.length - b.to.length,
    },

    {
      title: "No Of Days",
      dataIndex: "noofdays",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.noofdays.length - b.noofdays.length,
    },

    {
      title: "Reason",
      dataIndex: "reason",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.reason.length - b.reason.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div className="dropdown action-label text-center">
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i
              className={
                text === "new"
                  ? "far fa-dot-circle text-purple"
                  : text === "pending"
                  ? "far fa-dot-circle text-info"
                  : text === "approved"
                  ? "far fa-dot-circle text-success"
                  : "far fa-dot-circle text-danger"
              }
            />{" "}
            {text}
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-purple" /> New
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-info" /> Pending
            </Link>
            <Link
              className="dropdown-item"
              to="#"
            >
              <i className="far fa-dot-circle text-success" /> Approved
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-danger" /> Declined
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Action",
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
              data-bs-target="#edit_leave"
            >
              <i className="fa fa-pencil m-r-5" onClick={() => setSelect_id(record.id)}/> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa-regular fa-trash-can m-r-5" onClick={() => setSelect_id2(record.id)}/> Delete
            </Link>
          </div>
        </div>
      ),
      sorter: true,
    },
  ];

  const approvable_columns = [
    {
      title: "Employee",
      dataIndex: "name",
      render: (text, record) => (
        <span className="table-avatar">
          <Link to="/profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <span className="table-avatar">
            <Link to="#" className="avatar"></Link>
            {text}
          </span>
        </span>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "Leave Type",
      dataIndex: "leavetype",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "From",
      dataIndex: "from",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.from.length - b.from.length,
    },
    {
      title: "To",
      dataIndex: "to",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.to.length - b.to.length,
    },

    {
      title: "No Of Days",
      dataIndex: "noofdays",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.noofdays.length - b.noofdays.length,
    },

    {
      title: "Reason",
      dataIndex: "reason",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.reason.length - b.reason.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      render: (text, record) => (
        <div className="dropdown action-label text-center">
          <Link
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            to="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i
              className={
                text === "new"
                  ? "far fa-dot-circle text-purple"
                  : text === "pending"
                  ? "far fa-dot-circle text-info"
                  : text === "approved"
                  ? "far fa-dot-circle text-success"
                  : "far fa-dot-circle text-danger"
              }
            />{" "}
            {text}
          </Link>

          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-purple"/> New
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => updateStat(record.id, 'approved')}>
              <i className="far fa-dot-circle text-success"/> Approved
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => updateStat(record.id, 'declined')}>
              <i className="far fa-dot-circle text-danger"/> Declined
            </Link>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
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
              data-bs-target="#edit_leave"
            >
              <i className="fa fa-pencil m-r-5" onClick={() => setSelect_id(record.id)}/> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa-regular fa-trash-can m-r-5" onClick={() => setSelect_id2(record.id)}/> Delete
            </Link>
          </div>
        </div>
      ),
      sorter: true,
    },
  ];

  const table_mapper = type => {
    const table = type.map((leave, index) => ({
      id: leave.id || index,
      image: leave.image || Avatar_01, // Assuming you fetch image or have a default one
      name: leave.name,
      role: leave.role,
      leavetype: leave.leaveType.label,
      from: leave.from,
      to: leave.to,
      noofdays: leave.numDays,
      reason: leave.leaveReason,
      status: leave.status.stat,
    }));

    if (table){
      return table
    }else{
      return []
    }
  }

  const approvable_leaves = leaves.filter(leave => leave.status.stat === 'new')
  const approved_leaves = leaves.filter(leave => leave.status.stat === 'approved')

  const table = table_mapper(leaves)
  const approvable_table = table_mapper(approvable_leaves)
  const approved_table = table_mapper(approved_leaves)

  const statsData = [
    {
      id: 1,
      title: "Today Presents",
      value: "12 / 60",
    },
    {
      id: 2,
      title: "Planned Leaves",
      value: "8",
      subText: "Today",
    },
    {
      id: 3,
      title: "Unplanned Leaves",
      value: "0",
      subText: "Today",
    },
    {
      id: 4,
      title: "Pending Requests",
      value: "12",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        {/* Page Content */}
        <ShowToast/>
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Leaves"
            title="Dashboard"
            subtitle="Leaves"
            modal="#add_leave"
            name="Add Leave"
          />
          {/* /Page Header */}
          {/* Leave Statistics */}
          <div className="row">
            {statsData.map((stat, index) => (
              <div className="col-md-3 d-flex" key={index}>
                <div className="stats-info w-100">
                  <h6>{stat.title}</h6>
                  {stat.subText ? (
                    <h4>
                      {stat.value} <span>{stat.subText}</span>
                    </h4>
                  ) : (
                    <h4>{stat.value}</h4>
                  )}
                </div>
              </div>
            ))}
          </div>
          <LeaveFilter />
          {/* /Leave Statistics */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={table}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
                <h1>Approved Leaves</h1>
                <Table
                  columns={columns}
                  dataSource={approved_table}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
                <h1>Approvable Leaves</h1>
                <Table
                  columns={approvable_columns}
                  dataSource={approvable_table}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
        {/* Add Leave Modal */}
        <AdminLeaveAddModelPopup document_id={select_id}/>
        {/* /Add Leave Modal */}

        {/* Delete Modal */}
        <DeleteModal document_id={select_id2} table="leaves" name="Delete Leaves" routeref='/adminleaves'/>
        {/* Delete Modal */}
      </div>
    </>
  );
};

export default AdminLeave;
