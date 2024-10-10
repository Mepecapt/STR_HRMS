import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import db from "../../firebase";
import { create_docID, fetch_save3 } from "../../firebase_utils/fetchData";
import { modal_adder } from "../../utils/funcs";

const RolesPermissionsModal = ({ documentID }) => {
  const { register, handleSubmit, reset } = useForm();
  const { register: register2, handleSubmit: handleSubmit2, reset: reset2 } = useForm();

  const onSubmit = async (data) => {
    const input_data = {role: data.role, checked: false}

    modal_adder('roles', input_data, '/roles-permissions')
  };

  const onUpdate = async (data) => {
    const input_data = {role: data.role, checked: false}

    modal_adder('roles', input_data, '/roles-permissions', documentID)
  };

  return (
    <>
      {/* Add Role Modal */}
      <div id="add_role" className="modal custom-modal fade" role="dialog">
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Role Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" name="role" type="text" {...register('role', {required: true})}/>
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
      {/* /Add Role Modal */}
      {/* Edit Role Modal */}
      <div id="edit_role" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modal-md">
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
              <form onSubmit={handleSubmit2(onUpdate)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Role Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    {...register2('role', {required: true})}
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
      {/* /Edit Role Modal */}
    </>
  );
};

export default RolesPermissionsModal