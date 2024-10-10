import { Table } from "antd";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import EmployeeLeaveModelPopup from "../../../components/modelpopup/EmployeeLeaveModelPopup";
import SearchBox from "../../../components/SearchBox";
import { fetch_save, fetch_save2 } from "../../../firebase_utils/fetchData";
import {
Avatar_01,
} from "../../../Routes/ImagePath";
import { modal_adder, modal_updater } from "../../../utils/funcs";

const EmployeeLeave = () => {
  const [user, setUser] = useState([]);
  // const [leaves, setLeaves] = useState([])
  const [change, setChange] = useState([])
  const [selected_id, setSelected_id] = useState([])
  const [selected_id2, setSelected_id2] = useState([])
  const [leavetypes, setLeaveTypes] = useState([])
  const [status, setStatus] = useState('')
  const [hier, setHier] = useState([])
  const [loading, setLoading] = useState(false)
  // const [approver, setApprover] = useState('')
  const [leaves, setLeaves] = useState([{
    department: "IT",
    email: "sopir@gmail.com",
    fromDate: '"2024-09-09T18:00:00.000Z"',
    leaveReason: "fsdfsd",
    leaveType: {
      label: "Annual",
      value: "Annual",
    },
    numberOfDays: "12",
    remainingLeaves: "12",
    status: {
      approver_0: {
        label: "INTERN",
        value: "pending",
      },
      approver_1: {
        label: "TEAM LEAD",
        value: "pending",
      },
      approver_2: {
        label: "ENTRY LEVEL",
        value: "pending",
      },
    },
    id: '"ESgI6HtiD1bkGYmYzardOkCtuAn2_hierarchy_2:00:17 AM"',
    value: "Pending",
    toDate: '"2024-09-24T18:00:00.000Z"',
  }]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch_save('leaves', setLeaves)
      await fetch_save('leavetypes', setLeaveTypes)
      await fetch_save2('user', setUser)
      await fetch_save('hierarchy', setHier)
      setLoading(true)
    }

    fetchData()
  }, [change])

  const user_leaves = leaves.filter((leave) => leave.email === user?.email)
  const active_leavetype = leavetypes.filter(leave => leave.status === 'active')

  const get_key = () => {
    if (!user || !user.department) {
      console.warn('User or user.department is null or undefined.');
      return null; // Return early if user or department is missing
    }
    // Iterate over each approval data object
    for (const approvalData of hier) {
      // Check if the department matches
      if (approvalData.department === user?.department) {
        // Iterate over the keys of the current approvalData
        for (const key in approvalData) {
          // Check if the current key is an approver and if the label matches the user's designation
          if (key.startsWith('approver') && approvalData[key].label === user?.designation) {
            console.log(`Key of the approver matching designation: ${key}`);
            return key; // Return the key if found
          }
        }
      }
    }
    console.log('No matching approver found.');
    return null; // Return null if no match found
  };

  // setApprover(get_key())
  const approver = get_key()

  const filter_approvable = () => {
    let approved_leaves = [];
    let approvable_leaves = [];
  
    leaves.forEach((leave) => {
      const arrayOfObjects = Object.keys(leave.status).map(key => ({
        key: key, value: leave.status[key],
      }));
  
      const arrObj = arrayOfObjects || [];
  
      if (arrObj.length > 0) {
        const could_approve = arrObj.find(val => val.value.label === user?.designation);
  
        if (could_approve) {
          console.log(could_approve);

          // setApprover(could_approve.key)
  
          if (could_approve.value.value === 'approved') {
            approved_leaves.push(leave); // Add to approved_leaves if already approved
          } else {
            const currentApprover = parseInt(could_approve.key.split('_')[1]);
  
            if (currentApprover > 0) {
              const prevApproverKey = `approver_${currentApprover - 1}`;
              const prevApprover = arrObj.find(val => val.key === prevApproverKey);
  
              if (prevApprover && prevApprover.value.value === 'approved') {
                // Add to approvable_leaves
                approvable_leaves.push(leave);
              } else {
                console.warn('Previous approver has not approved yet.');
              }
            } else {
              approvable_leaves.push(leave); // If no previous approver, it's approvable
            }
          }
        }
      } else {
        console.error('arrObj is empty or does not contain the required structure.');
      }
    });
  
    return { approvable_leaves, approved_leaves };
  };

  const {approvable_leaves, approved_leaves} = filter_approvable()

  console.log(approvable_leaves);

  const checkOverallApprovalStatus = (leaveId) => {
    setLeaves(prevLeaves =>
      prevLeaves.map(leave => {
        if (leave.id === leaveId) {
          const approvers = Object.values(leave.status);

          // Check if any approver has declined
          const declined = approvers.some(approver => approver.value === "declined");
          if (declined) {
            modal_updater('leaves', {...leave, status: {...leave.status, stat: 'declined'}}, '/leaves-employee', leaveId)
          }

          // Check if all approvers have approved
          const allApproved = approvers.every(approver => approver.value === "approved");
          if (allApproved) {
            modal_updater('leaves', {...leave, status: {...leave.status, stat: 'approved'}}, '/leaves-employee', leaveId)
          }
        }
        return leave; // Return the leave unchanged if no condition is met
      })
    );
  };

  const updateApprover = (leaveId, approver, newValue) => {
    setLeaves(prevLeaves =>
      prevLeaves.map(leave => {
        // Check if the leave id matches the given leaveId
        if (leave.id === leaveId) {
          const updated_leave = {
            ...leave,
            status: {
              ...leave.status,
              [approver]: {
                ...leave.status[approver],
                value: newValue
              }
            }
          }
          modal_updater('leaves', updated_leave, 'none', leaveId)
          checkOverallApprovalStatus(leaveId)
        }
        return leave; // Return the leave unchanged if id doesn't match
      })
    );
  };

  user_leaves.map((leave, index) => {
    console.log(leave);
  })

  const create_source = data => {
    const data_source = data.map((leave, index) => ({
      id: leave.id || index,
      image: leave.image || Avatar_01, // Assuming you fetch image or have a default one
      name: leave.name || '',
      role: leave.role || '',
      leavetype: leave.leaveType.label || '',
      fromDate: JSON.parse(leave.fromDate) ? JSON.parse(leave.fromDate) : ' ',
      toDate: JSON.parse(leave.toDate) ? JSON.parse(leave.toDate) : ' ',
      numberOfDays: leave.numberOfDays || '',
      reason: leave.leaveReason || '',
      status: leave.status.stat || '',
    }));

    return data_source
  }

  const leaveElements = useMemo(() => create_source(user_leaves), [user_leaves]);
  const approvable_source = useMemo(() => create_source(approvable_leaves), [approvable_leaves]);
  const approved_source = useMemo(() => create_source(approved_leaves), [approved_leaves]);
  

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leavetype",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "From",
      dataIndex: "fromDate",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.fromDate.length - b.fromDate.length,
    },
    {
      title: "To",
      dataIndex: "toDate",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.toDate.length - b.toDate.length,
    },

    {
      title: "No Of Days",
      dataIndex: "numberOfDays",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.numberOfDays.length - b.numberOfDays.length,
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
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-info"/> Pending
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-success" /> Approved
            </Link>
            <Link className="dropdown-item" to="#">
              <i className="far fa-dot-circle text-danger"/> Declined
            </Link>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      className: "text-end",
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
              data-bs-target="#edit_leave"
            >
              <i className="fa fa-pencil m-r-5" onClick={() => setSelected_id(record.id)}/> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa fa-trash m-r-5" onClick={() => setSelected_id2(record.id)}/> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const approvable_columns = [
    {
      title: "Leave Type",
      dataIndex: "leavetype",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "From",
      dataIndex: "fromDate",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.fromDate.length - b.fromDate.length,
    },
    {
      title: "To",
      dataIndex: "toDate",
      render: (text) => <span>{text}</span>,

      sorter: (a, b) => a.toDate.length - b.toDate.length,
    },

    {
      title: "No Of Days",
      dataIndex: "numberOfDays",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.numberOfDays.length - b.numberOfDays.length,
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
            <Link className="dropdown-item" to="#" onClick={() => updateApprover(record.id, approver, 'approved')}>
              <i className="far fa-dot-circle text-success" /> Approved
            </Link>
            <Link className="dropdown-item" to="#" onClick={() => updateApprover(record.id, approver, 'declined')}>
              <i className="far fa-dot-circle text-danger" /> Declined
            </Link>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      className: "text-end",
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
              data-bs-target="#edit_leave"
            >
              <i className="fa fa-pencil m-r-5" onClick={() => setSelected_id(record.id)}/> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa fa-trash m-r-5" onClick={() => setSelected_id2(record.id)}/> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const used_leaves = (name, day) => {
    const leaves_uses = leaves.filter(leave => leave.leaveType.value === name)
    const remaining_leaves = parseInt(parseInt(day) - parseInt(leaves_uses.length))

    return remaining_leaves
  }

  const leaveStats2 = active_leavetype.map((leave, id) => ({
    id: id,
    title: leave.name,
    value: used_leaves(leave.name, leave.days) || leave.days,
  }));

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Leaves"
            title="Dashboard"
            subtitle="Leaves"
            modal="#add_leave"
            name="Add New"
          />

          <div className="row">
            {leaveStats2.map((stat, index) => (
              <div className="col-md-3" key={index}>
                <div className="stats-info">
                  <h6>{stat.title}</h6>
                  <h4>{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <SearchBox />
                <Table
                  columns={columns}
                  dataSource={leaveElements?.length > 0 ? leaveElements : []}
                  className="table-striped"
                />
                <h1>Approvable Leaves</h1>
                <Table
                  columns={approvable_columns}
                  dataSource={approvable_source?.length > 0 ? approvable_source : []}
                  className="table-striped"
                />
                <h1>Approved Leaves</h1>
                <Table
                  columns={columns}
                  dataSource={approved_source?.length > 0 ? approved_source : []}
                  className="table-striped"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Leave Modal */}
      <EmployeeLeaveModelPopup document_id={selected_id}/>
      {/* Add Leave Modal */}
      {/* Delete Modal */}
      <DeleteModal document_id={selected_id2} table='leaves' name="Delete Leaves" routeref='/leaves-employee'/>
      {/* Delete Modal */}
    </>
  );
};

export default EmployeeLeave;