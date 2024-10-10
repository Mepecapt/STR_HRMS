import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import db from "../../firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore"; // Import updateDoc
import { getAuth } from "firebase/auth";
import { fetcher, create_docID } from "../../firebase_utils/fetchData";
import { modal_adder, modal_updater } from "../../utils/funcs";

const AddRoleModal = ({ document_id, data }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();

  const addDepart = async (data) => {
    modal_adder('userroles', { name: data.role }, '/roles-permissions')
  };

  const updateDepart = async (data) => {
    modal_updater('userroles', { name: data.role }, '/roles-permissions', document_id)
  };

  return (
    <>
      {/* Add Department Modal */}
      <div
        id="add_role_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Role</h5>
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
                    Role Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="role"
                    {...register('role', { required: true })}
                  />
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
              <h5 className="modal-title">Edit Role</h5>
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
              <form onSubmit={handleSubmit2(updateDepart)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Role Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    {...register2('role', { required: true })}
                  />
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
      {/* /Edit Department Modal */}
    </>
  );
};

export default AddRoleModal;
