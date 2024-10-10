import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { approval_dropdown, fetch_dropdown, fetch_save } from "../../../../firebase_utils/fetchData";
import { modal_adder, modal_updater } from "../../../../utils/funcs";
import { Link } from "react-router-dom";

const LeaveApproval = () => {
  const { handleSubmit, control, setValue, getValues } = useForm();
  const [designation, setDesignation] = useState([])
  const [user, setUser] = useState([])
  const [department, setDepartment] = useState([])
  const [change, setChange] = useState(null)
  const [length, setLength] = useState([])
  const [hierarchy, setHierarchy] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      await approval_dropdown('designation', setDesignation)
      await fetch_dropdown('designation', setLength)
      await fetch_save('user', setUser)
      await fetch_save('hierarchy', setHierarchy)
      await fetch_dropdown('department', setDepartment)
    }

    fetchData()
  }, [change])

  const userOptions = user.map((user, key) => ({
    label: user.fname + " " + user.lname,
    value: user.fname + " " + user.lname,
  }));

  const changed = (e) => {
    setDesignation(designation.filter(v => v !== e))
  }

  const departmentOptions = department

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

  const handleRemoveApprover = (id) => {
    setLength((prevLength) => prevLength.filter((_, index) => index !== id));
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    const departmentExists = hierarchy.some(item => item.department === data.department);

    if (departmentExists){
      const existDepartment = hierarchy.find(item => item.department === data.department);

      console.log(existDepartment.id);
      
      modal_updater('hierarchy', data, '/approval-setting', existDepartment.id)
    }else{
      modal_adder('hierarchy', data, '/approval-setting')
    }

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <div className="input-block mb-3 row">
          <label className="control-label col-form-label col-md-12">
            Default Leave Approval
          </label>
          <div className="col-md-12 approval-option">
            <label className="radio-inline">
              <input
                id="radio-single"
                className="me-2 default_offer_approval"
                defaultValue="seq-approver"
                name="default_leave_approval"
                type="radio"
              />
              Sequence Approval (Chain){" "}
              <sup>
                {" "}
                <span className="badge info-badge">
                  <i className="fa fa-info" aria-hidden="true" />
                </span>
              </sup>
            </label>
            <label className="radio-inline ms-2">
              <input
                id="radio-multiple1"
                className="me-2 default_offer_approval"
                defaultValue="sim-approver"
                defaultChecked
                name="default_leave_approval"
                type="radio"
              />
              Simultaneous Approval{" "}
              <sup>
                <span className="badge info-badge">
                  <i className="fa fa-info" aria-hidden="true" />
                </span>
              </sup>
            </label>
          </div>
        </div>
        <div className="input-block mb-3 form-row">
          <label className="control-label col-form-label col-sm-12">
            Department
          </label>
          <div className="col-sm-6">
            <Controller
              name="department"
              control={control}
              render={({ field: { onChange } }) => (
                <Select
                  options={departmentOptions}
                  placeholder="Select Department"
                  styles={customStyles}
                  onChange={(e) => {
                    onChange(e.value)
                    
                  }
                  }
                />
              )}
            />
          </div>
        </div> 

{
  length.length > 0 && length.map((desig, id) => {
    return (
      <div key={id} className="input-block mb-3 form-row">
        <label className="control-label col-form-label col-sm-12">
          {desig.name}
        </label>
        <div className="col-sm-6">
          <Controller
            name={`approver_${id}`}
            control={control}
            render={({ field: { onChange } }) => (
              <>
                <div>
                  <Select
                    options={designation}
                    placeholder="Select"
                    styles={customStyles}
                    onChange={(e) => {
                      onChange(e);
                      changed(e);
                    }}
                  />
                </div>
                  <Link
                    to="#"
                    className="remove_ex_exp_approver btn rounded border text-danger"
                    onClick={() => handleRemoveApprover(id)} // Updated event handler
                  >
                    <i className="fa fa-times" aria-hidden="true" />
                  </Link>
              </>
            )}
          />
        </div>
      </div>
    )
  })
}
        <div className="m-t-30 row">
          <div className="col-md-12 submit-section">
            <button
              id="leave_approval_set_btn"
              type="submit"
              className="btn btn-primary submit-btn"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LeaveApproval;
