import React, { useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { modal_adder, modal_updater } from '../../utils/funcs'

const AddandEditOvertime = ({ documentID }) => {
  // Separate useForm for Add Overtime
  const {
    handleSubmit: handleAddSubmit,
    control: controlAdd,
    reset: resetAdd,
  } = useForm();

  // Separate useForm for Edit Overtime
  const {
    handleSubmit: handleEditSubmit,
    control: controlEdit,
    reset: resetEdit,
  } = useForm();

  const optionsOne = [
    { value: 1, label: "-" },
    { value: 2, label: "Daily Rate" },
    { value: 3, label: "Hourly Rate" },
  ];

  const optionsTwo = [
    { value: 1, label: "-" },
    { value: 2, label: "Daily Rate" },
    { value: 3, label: "Hourly Rate" },
  ];

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

  const onAddSubmit = (data) => {
    console.log("Add Form Data:", data);
    // Perform the API call to save the data
    modal_adder('overtime', data, '/overtime')

    resetAdd(); // Reset form after submit
  };

  const onEditSubmit = (data) => {
    console.log("Edit Form Data:", data);
    // Perform the API call to save the updated data

    modal_updater('overtime', data, '/overtime', documentID)
    resetEdit(); // Reset form after submit
  };

  return (
    <>
      {/* Add Overtime Modal */}
      <div id="add_overtime" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Overtime</h5>
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
              <form onSubmit={handleAddSubmit(onAddSubmit)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="addName"
                    control={controlAdd}
                    render={({ field }) => (
                      <input className="form-control" type="text" {...field} />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="addRateType"
                    control={controlAdd}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="-"
                        options={optionsOne}
                        onChange={(value) => field.onChange(value)}
                        className="select"
                        styles={customStyles}
                      />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="addRate"
                    control={controlAdd}
                    render={({ field }) => (
                      <input className="form-control" type="text" {...field} />
                    )}
                    rules={{ required: true }}
                  />
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
      {/* /Add Overtime Modal */}

      {/* Edit Overtime Modal */}
      <div id="edit_overtime" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Overtime</h5>
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
              <form onSubmit={handleEditSubmit(onEditSubmit)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="editName"
                    control={controlEdit}
                    render={({ field }) => (
                      <input className="form-control" type="text" {...field} />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="editRateType"
                    control={controlEdit}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="-"
                        options={optionsTwo}
                        onChange={(value) => field.onChange(value)}
                        className="select"
                        styles={customStyles}
                      />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Rate <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="editRate"
                    control={controlEdit}
                    render={({ field }) => (
                      <input className="form-control" type="text" {...field} />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Overtime Modal */}
    </>
  );
};

export default AddandEditOvertime;
