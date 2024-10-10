import React from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import db from "../../firebase";
import { create_docID } from "../../firebase_utils/fetchData";
import { modal_adder, modal_updater } from "../../utils/funcs";

const LeaveTypeModal = ({ document_id }) => {
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
  } = useForm(); // Form for adding a leave type

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm(); // Form for editing a leave type

  const addLeaveType = async (data) => {
    
    await modal_adder('leavetypes', { name: data.leavetype, days: data.leavedays, status: 'active' }, '/leave-type')
  };

  const updateLeaveType = async (data) => {
    await modal_updater('leavetypes', { name: data.leavetype, days: data.leavedays }, '/leave-type', document_id)
  };

  return (
    <>
      {/* Add Leave Type Modal */}
      <div id="add_leavetype" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Leave Type</h5>
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
              <form onSubmit={handleSubmitAdd(addLeaveType)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    {...registerAdd("leavetype", { required: true })}
                  />
                  {errorsAdd.leaveType && <p className="text-danger">This field is required</p>}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Number of days <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    {...registerAdd("leavedays", { required: true })}
                  />
                  {errorsAdd.numberOfDays && <p className="text-danger">This field is required</p>}
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
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
      {/* /Add Leave Type Modal */}

      {/* Edit Leave Type Modal */}
      <div id="edit_leavetype" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Leave Type</h5>
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
              <form onSubmit={handleSubmitEdit(updateLeaveType)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="Casual Leave"
                    {...registerEdit("leavetype", { required: true })}
                  />
                  {errorsEdit.leaveType && <p className="text-danger">This field is required</p>}
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Number of days <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    defaultValue={12}
                    {...registerEdit("leavedays", { required: true })}
                  />
                  {errorsEdit.numberOfDays && <p className="text-danger">This field is required</p>}
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Leave Type Modal */}
    </>
  );
};

export default LeaveTypeModal;
