import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { current_user, fetch_dropdown, fetch_save, fetch_save2 } from "../../firebase_utils/fetchData";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import db from "../../firebase";
import { modal_adder, modal_updater } from "../../utils/funcs";
import { setUIValue } from "@testing-library/user-event/dist/cjs/document/UI.js";

const EmployeeLeaveModelPopup = ({ document_id }) => {
  const [hier, setHier] = useState([])
  const [curr_type, setCurrType] = useState('')
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [user, setUser] = useState([])
  const [change, setChange] = useState(null)
  const [leavetype, setLeaveType] = useState([])
  const [leavetype2, setLeaveType2] = useState([])
  const [leaves, setLeaves] = useState([])
  const [curr_leave, setCurrLeave] = useState('')
  const [used_days, setUsed_Days] = useState(0)
  const [error, setError] = useState(null)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({defaultValues: {
    numberOfDays: used_days,
    totalDays: ''
  }});
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      await fetch_dropdown('leavetypes', setLeaveType)
      await fetch_save('leavetypes', setLeaveType2)
      await fetch_save2('user', setUser)
      await fetch_save('leaves', setLeaves)
      await fetch_save('hierarchy', setHier)
  }

    fetchData()
  }, [change])

  useEffect(() => {
    if(selectedDate1 && selectedDate2){
      const date1 = new Date(selectedDate2);
      const date2 = new Date(selectedDate1);

      const differenceInDays = Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24) + 1)
      console.log(differenceInDays);
      setUsed_Days(differenceInDays)
      setValue('numberOfDays', differenceInDays)
    }
  }, [selectedDate1, selectedDate2])

  useEffect(() => {
    if(leavetype){
      console.log(curr_type, leavetype);
      const curr_leavetype = leavetype2.find(type => type.name === curr_type)
      if (curr_leavetype){
        console.log(curr_leavetype.days);
        setCurrLeave(curr_leavetype)
        setValue('totalDays' , curr_leavetype.days)
      }
    }
  }, [curr_type])

  const totalLeaves = () => {
    let total_leaves = 0
    leaves.map((leave, id) => {
      total_leaves += parseInt(leave.numberOfDays)
    })

    if (total_leaves >= parseInt(curr_leave.days)){
      setError('Leave Exceeeds Total Days')
    }

    console.log(total_leaves);
  }

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };

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
    console.log(curr_type)
    totalLeaves()
  }

  const onSubmit = async (data) => {
    console.log("Form Data:", data)

    const curr_hier = hier.find(hier => hier.department === user.department)
    console.log(curr_hier);

    modal_adder(
      'leaves', 
      { ...data, 
      email: user.email, 
      status: {...curr_hier, stat: 'new'}, 
      department: user.department, 
      fromDate: JSON.stringify(selectedDate1), 
      toDate: JSON.stringify(selectedDate2)}, 
      '/leaves-employee')
  };

  const onEditSubmit = async (data) => {
    console.log("Edit Form Data:", data);

    modal_updater('leaves', { ...data, user: user.email, status: "new", department: data.department, fromDate: JSON.stringify(selectedDate1), toDate: JSON.stringify(selectedDate2) }, '/leaves-employee', document_id)
  };

  return (
    <>
      {/* Add Leave Modal */}
      <div id="add_leave" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Leave</h5>
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
                { error ? <span className="text-danger">{error}</span> : <></> }
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="leaveType"
                    control={control}
                    render={({ field: {onChange} }) => (
                      <Select
                        options={leavetype}
                        placeholder="Select"
                        styles={customStyles}
                        onChange={opt => {
                          onChange(opt)
                          setCurrType(opt.value)
                        }}
                      />
                    )}
                  />
                  {errors.leaveType && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    From <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          className="form-control datetimepicker"
                          dateFormat="dd-MM-yyyy"
                        />
                    {errors.fromDate && (
                      <span className="text-danger">This field is required</span>
                    )}
                  </div>
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    To <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate2}
                          onChange={handleDateChange2}
                          className="form-control datetimepicker"
                          dateFormat="dd-MM-yyyy"
                        />
                    {errors.toDate && (
                      <span className="text-danger">This field is required</span>
                    )}
                  </div>
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Number of days <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    type="text"
                    {...register("numberOfDays", { required: true })}
                  />
                  {errors.numberOfDays && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Remaining Leaves <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    type="text"
                    {...register("remainingLeaves")}
                  />
                  {errors.remainingLeaves && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Total Days<span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    type="text"
                    {...register("totalDays", { required: true })}
                  />
                  {errors.totalDays && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    {...register("leaveReason")}
                  />
                  {errors.leaveReason && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Leave Modal */}
      <div id="edit_leave" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Leave</h5>
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
              <form onSubmit={handleSubmitEdit(onEditSubmit)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="editLeaveType"
                    control={controlEdit}
                    render={({ field: onChange }) => (
                      <Select
                        options={leavetype}
                        placeholder="Select"
                        styles={customStyles}
                        onChange={onChange}
                      />
                    )}
                  />
                  {errorsEdit.editLeaveType && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    From <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          className="form-control datetimepicker"
                          dateFormat="dd-MM-yyyy"
                        />
                    {errorsEdit.editFromDate && (
                      <span className="text-danger">This field is required</span>
                    )}
                  </div>
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    To <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                        <DatePicker
                          selected={selectedDate2}
                          onChange={handleDateChange2}
                          className="form-control datetimepicker"
                          dateFormat="dd-MM-yyyy"
                        />
                    {errorsEdit.editToDate && (
                      <span className="text-danger">This field is required</span>
                    )}
                  </div>
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Number of days <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    type="text"
                    {...registerEdit("editNumberOfDays", { required: true })}
                  />
                  {errorsEdit.editNumberOfDays && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Remaining Leaves <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    defaultValue={12}
                    type="text"
                    {...registerEdit("editRemainingLeaves", { required: true })}
                  />
                  {errorsEdit.editRemainingLeaves && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    {...registerEdit("editLeaveReason", { required: true })}
                  />
                  {errorsEdit.editLeaveReason && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
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

export default EmployeeLeaveModelPopup;