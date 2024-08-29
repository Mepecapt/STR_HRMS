import React from "react";
import { useForm } from "react-hook-form";
import db from "../../firebase"
import { doc, setDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { fetcher, create_docID } from "../../firebase_utils/fetchData"

const DepartmentModal = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const docID = create_docID()

  const addDepart = async (data) => {
    try {
      const newDocRef = doc(db, 'department', docID)
      await setDoc(newDocRef, {department: data.department})
      console.log("Department added successfully");
    } catch (e) {
      console.error("Error adding department: ", e);
    }
  };

  return (
    <>
      {/* Add Department Modal */}
      <div
        id="add_department"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Department</h5>
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
              <form onSubmit={handleSubmit(addDepart)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Department Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" name="department" {...register('department', {required: true})}/>
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
      {/* /Add Department Modal */}
      {/* Edit Department Modal */}
      <div
        id="edit_department"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Department</h5>
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
              <form>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Department Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    defaultValue="IT Management"
                    type="text"
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="reset"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Department Modal */}
    </>
  );
};

export default DepartmentModal;

