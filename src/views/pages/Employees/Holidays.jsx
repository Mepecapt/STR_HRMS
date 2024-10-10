/* eslint-disable no-unused-expressions */

import { Table } from "antd";
import { AddHoliday } from "../../../components/modelpopup/AddHoliday";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { base_url } from "../../../base_urls";
import { fetch_save } from "../../../firebase_utils/fetchData";
import ShowToast from "../../../utils/ShowToast";

const Holidays = () => {
  const [users, setUsers] = useState([]);
  const [holidays, setHolidays] = useState([])
  const [change, setChange] = useState(null)
  const [element_id, setElement_id] = useState(null)
  const [element_id2, setElement_id2] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      await fetch_save('holidays', setHolidays)
    }

    fetchData()
  }, [change])

  useEffect(() => {
    axios.get(base_url + "/api/holiday.json").then((res) => setUsers(res.data));
  }, []);

  const holidayElements = holidays.map((holiday, index) => ({
    key: index,
    id: index,
    Title: holiday.holidayName,
    HolidayDate: JSON.parse(holiday.holidayDate),
    Day: holiday.holidayDay,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Title",
      dataIndex: "Title",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.Title.length - b.Title.length,
    },
    {
      title: "HolidayDate",
      dataIndex: "HolidayDate",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.HolidayDate.length - b.HolidayDate.length,
    },
    {
      title: "Day",
      dataIndex: "Day",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.Day.length - b.Day.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="dropdown dropdown-action ">
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
              data-bs-target="#edit_holiday"
            >
              <i className="fa fa-pencil m-r-5" onClick={() => setElement_id(record.id)}/> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete"
            >
              <i className="fa-regular fa-trash-can m-r-5" onClick={() => setElement_id2(record.id)}/> Delete
            </Link>
          </div>
        </div>
      ),
      sorter: true,
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <ShowToast/>
        {/* Page Content */}
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Holidays"
            title="Dashboard"
            subtitle="Holidays"
            modal="#add_holiday"
            name="Add Holiday"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={holidayElements?.length > 0 ? holidayElements : []}
                  className="table-striped"
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      <AddHoliday document_id={element_id}/>
      <DeleteModal document_id={element_id2} table='holidays' name="Delete Holiday" routeref='/holidays'/>
    </>
  );
};

export default Holidays;
