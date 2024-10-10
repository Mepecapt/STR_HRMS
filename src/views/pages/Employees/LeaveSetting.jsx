import React, { useEffect, useRef, useState } from "react";
import LeaveSettingCustomPolicy from "./LeaveSettingCustomPolicy";
import DeleteModal from "../../../components/modelpopup/DeleteModal";
import LeaveSettingAddModelPopup from "../../../components/modelpopup/LeaveSettingAddModelPopup";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { fetch_save } from "../../../firebase_utils/fetchData";
import { modal_updater, only_update } from "../../../utils/funcs";
import { input } from "@testing-library/user-event/dist/cjs/event/input.js";

const LeaveSettings = () => {
  const [leave_types, setLeave_types] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [change, setChange] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetch_save("leavetypes", setLeave_types);
    };

    fetchData();
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const checkChange = (e, leave) => {
    console.log(e.target.checked);
    
    const input_data = {
      ...leave,
      status: e.target.checked
    }

    only_update('leavetypes', input_data, leave.id)
  }

  // This function will handle saving the edited leave type
  const handleSave = (index, leave) => {
    const daysInputValue = inputRefs.current[index].value;

    const input_data = {
      ...leave,
      days: daysInputValue
    }

    only_update('leavetypes', input_data, leave.id)

    setEditingIndex(null); // Close the edit mode after saving
  };

  // Create a ref to store the input elements for each leave type
  const inputRefs = useRef([]);

  return (
    <>
      <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Leave Settings"
            title="Dashboard"
            subtitle="Leave Settings"
            modal="#add_custom_policy"
            name="Add New"
          />
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              {leave_types.map((leave, index) => (
                <div className="card leave-box" key={index} id={`leave_${leave.name.toLowerCase()}`}>
                  <div className="card-body">
                    <div className="h3 card-title with-switch">
                      {leave.name}
                      <div className="onoffswitch">
                        <input
                          type="checkbox"
                          name="onoffswitch"
                          className="onoffswitch-checkbox"
                          id={`switch_${leave.name.toLowerCase()}`}
                          onChange={(e) => checkChange(e, leave)}
                          defaultChecked={leave.status}
                        />
                        <label
                          className="onoffswitch-label"
                          htmlFor={`switch_${leave.name.toLowerCase()}`}
                        >
                          <span className="onoffswitch-inner" />
                          <span className="onoffswitch-switch" />
                        </label>
                      </div>
                    </div>
                    <div className="leave-item">
                      {/* Days Leave */}
                      <div className="leave-row">
                        <div className="leave-left">
                          <div className="input-box">
                            <div className="input-block">
                              <label>Days</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={leave.days}
                                disabled={editingIndex !== index}
                                ref={(el) => (inputRefs.current[index] = el)} // Assign ref to input
                              />
                            </div>
                          </div>
                        </div>
                        {editingIndex === index ? (
                          <div className="leave-right">
                            <button
                              className="btn btn-white leave-cancel-btn"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary leave-save-btn"
                              onClick={() => handleSave(index, leave)} // Save changes
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="leave-right">
                            <button
                              className="leave-edit-btn"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                      {/* /Days Leave */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* /Page Content */}

        <LeaveSettingCustomPolicy />
        <LeaveSettingAddModelPopup />
        <DeleteModal Name="Custom Policy" />
      </div>
    </>
  );
};

export default LeaveSettings;
