import React, { useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import db from "../../firebase"
import { doc, setDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { create_docID } from "../../firebase_utils/fetchData";

const AddDesingnationModelPopup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [desigs, setDesigs] = useState(null)

  const docID = create_docID() 

  const addDesig = async (data) => {
    try {
      const newDocRef = doc(db, 'designation', docID)
      await setDoc(newDocRef, {department: data.designation})
      console.log("Department added successfully");
    } catch (e) {
      console.error("Error adding department: ", e);
    }
  };

  const designation = [
    { value: 1, label: "Select Department" },
    { value: 2, label: "Web Development" },
    { value: 3, label: "IT Management" },
    { value: 4, label: " Marketing" },
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
                  <input className="form-control" type="text" name="designation" {...register('designation', {required: true})} />
                </div>
                {/* <div className="input-block mb-3">
                  <label className="col-form-label">
                    Department <span className="text-danger">*</span>
                  </label>

                  <Select
                    options={designation}
                    placeholder="Select Department"
                    styles={customStyles}
                    name="desig_depart"
                    {...register('desig_depart', {required: true})}
                  />
                </div> */}
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
              <form>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Designation Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="input-block mb-3">
                  <label className="col-form-label">
                    Department <span className="text-danger">*</span>
                  </label>

                  <Select
                    options={designation}
                    placeholder="Select Department"
                    styles={customStyles}
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    data-bs-dismiss="modal"
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
