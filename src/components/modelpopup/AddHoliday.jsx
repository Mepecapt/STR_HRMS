import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { create_docID } from "../../firebase_utils/fetchData";
import { updateDoc, doc, setDoc } from "firebase/firestore"; 
import db from "../../firebase";
import { modal_adder, modal_updater, model_updater } from "../../utils/funcs";

export const AddHoliday = ({ document_id }) => {
  const [selectedDate1, setSelectedDate1] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();
  
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  const onSubmit = async (data) => {
    console.log(data); // Handle form submission logic here

    const docID = create_docID()

      // Convert the string to a Date object
    const date = new Date(selectedDate1);
  
    // Get the day of the week (0-6)
    const dayOfWeek = date.getDay();
    const holiDate = JSON.stringify(selectedDate1)
  
    // Map the day number to the name of the day
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[dayOfWeek];

    const holidays = {
      holidayName: data.holidayName,
      holidayDate: holiDate,
      holidayDay: dayName
    }
    
    modal_adder('holidays', holidays, '/holidays')
  }

  const onUpdate = async (data) => {
    // Convert the string to a Date object
  const date = new Date(selectedDate1);

  // Get the day of the week (0-6)
  const dayOfWeek = date.getDay();

  // Map the day number to the name of the day
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[dayOfWeek];
  const holiDate = JSON.stringify(selectedDate1)

  const holidays = {
    holidayName: data.holidayName,
    holidayDate: holiDate,
    holidayDay: dayName
  }

  modal_updater('holidays', holidays, '/holidays', document_id)
  };

  return (
    <div>
      {/* Add Holiday Modal */}
      <div className="modal custom-modal fade" id="add_holiday" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Holiday</h5>
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
                    Holiday Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("holidayName", { required: true })}
                  />
                  {errors.holidayName && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Holiday Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <DatePicker
                      selected={selectedDate1}
                      onChange={handleDateChange1}
                      className="form-control datetimepicker"
                      type="date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    type="submit"
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Holiday Modal */}
      <div className="modal custom-modal fade" id="edit_holiday" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Holiday</h5>
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
                    Holiday Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="New Year"
                    {...register2("holidayNameEdit", { required: true })}
                  />
                  {errors.holidayNameEdit && (
                    <span className="text-danger">This field is required</span>
                  )}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Holiday Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <DatePicker
                      selected={selectedDate1}
                      onChange={handleDateChange1}
                      className="form-control datetimepicker"
                      type="date"
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    type="submit"
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
