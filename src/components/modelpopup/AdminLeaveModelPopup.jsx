import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { current_user, fetch_dropdown, fetch_save3 } from "../../firebase_utils/fetchData";
import { modal_adder, modal_updater } from "../../utils/funcs";


export const AdminLeaveAddModelPopup = ({ document_id }) => {
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm();
  const { register: register2, control: control2, handleSubmit: handleSubmit2, setValue: setValue2, formState: { errors2 } } = useForm();
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [leaveType, setLeaveType] = useState(null);
  const [leave_types, setLeave_types] = useState([])
  const [leaves, setLeaves] = useState([])
  const [change, setChange] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      await fetch_dropdown('leavetypes', setLeave_types)
      await fetch_save3('leaves', setLeaves, document_id)
    }

    fetchData()
  }, [change])
  
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

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
    // Calculate number of days whenever start date changes
    if (date && selectedDate2) {
      const diffDays = Math.ceil((selectedDate2 - date) / (1000 * 60 * 60 * 24));
      setValue("numDays", diffDays);
    }
  };

  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
    // Calculate number of days whenever end date changes
    if (selectedDate1 && date) {
      const diffDays = Math.ceil((date - selectedDate1) / (1000 * 60 * 60 * 24));
      setValue("numDays", diffDays);
    }
  };

  const onSubmit = (data) => {
    console.log("Form Data Submitted: ", data);

    const email = current_user.email;

    modal_adder('leaves', {
      ...data,
      email: email,
      status: 'approved',
      fro: JSON.stringify(selectedDate1),
      to: JSON.stringify(selectedDate2)
    }, '/adminleaves');
  };

  const onUpdate = data => {
    
  }

  return (
    <>
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="leaveType"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        options={leave_types}
                        placeholder="Select"
                        styles={customStyles}
                        value={leave_types.find(leave => leave.value === value)}
                        onChange={(option) => {
                          onChange(option.value);
                          setLeaveType(option);
                        }}
                      />
                    )}
                  />
                  {errors.leaveType && <p className="text-danger">Leave Type is required</p>}
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
                    {errors.fromDate && <p className="text-danger">Start date is required</p>}
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
                    {errors.toDate && <p className="text-danger">End date is required</p>}
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
                    {...register("numDays")}
                  />
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
                    {...register("remainingLeaves")}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    {...register("leaveReason", { required: true })}
                  />
                  {errors.leaveReason && <p className="text-danger">Leave Reason is required</p>}
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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
              <form onSubmit={handleSubmit2(onUpdate)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="leaveType"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        options={leave_types}
                        placeholder="Select"
                        styles={customStyles}
                        value={leave_types.find(leave => leave.value === value)}
                        onChange={(option) => {
                          onChange(option.value);
                          setLeaveType(option);
                        }}
                      />
                    )}
                  />
                  {errors.leaveType && <p className="text-danger">Leave Type is required</p>}
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
                    {errors.fromDate && <p className="text-danger">Start date is required</p>}
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
                    {errors.toDate && <p className="text-danger">End date is required</p>}
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
                    {...register("numDays")}
                  />
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
                    {...register("remainingLeaves")}
                  />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    {...register("leaveReason", { required: true })}
                  />
                  {errors.leaveReason && <p className="text-danger">Leave Reason is required</p>}
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    type="submit"
                  >
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
