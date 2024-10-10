import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import db from "../../firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { create_docID, fetch_save2, fetch_save3 } from "../../firebase_utils/fetchData";
import { modal_adder, modal_updater } from "../../utils/funcs";

const AddDesingnationModelPopup = ({ document_id, data }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();

  const current_desig = data.find((info) => info.id === document_id) || {}

  const addDesig = async (data) => {
    const input_data = { name: data.designation }
    modal_adder('designation', input_data, '/designations')
  };

  const updateDesig = async (data) => {
    const input_data = { name: data.designation }
    modal_updater('designation', input_data, '/designations', document_id)
  };

  return (
    <>
      <div
        id="add_designation"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Designation</h5>
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
              <form onSubmit={handleSubmit(addDesig)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Designation Name <span className="text-danger">*</span>
                  </label>
                  <input defaultValue={current_desig.name} className="form-control" type="text" name="designation" {...register('designation', {required: true})} />
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

      <div
        id="edit_designation"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Designation</h5>
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
              <form onSubmit={handleSubmit2(updateDesig)}>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Designation Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" name="designation" {...register2('designation', {required: true})}/>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
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

export default AddDesingnationModelPopup;
