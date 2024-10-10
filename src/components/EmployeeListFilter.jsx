import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { fetch_dropdown } from "../firebase_utils/fetchData";

const EmployeeListFilter = ({ setCriteria }) => {
  const [designationOptions, setDesignationOptions] = useState([]);
  const [change, setChange] = useState(false); // Keep track of changes to refetch if needed

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      await fetch_dropdown("designation", setDesignationOptions);
    };

    fetchData();
  }, [change]);

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

  const onSubmit = (data) => {
    // Prepare the criteria based on form data
    const criteria = {
      employeeId: data.employeeId || '',
      employeeName: data.employeeName || '',
      designation: data.designation ? data.designation.value : '',
    };

    // Pass the criteria to the parent component
    setCriteria(criteria);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row filter-row">
        <div className="col-sm-6 col-md-3">
          <div className={`input-block form-focus ${errors.employeeId ? "focused" : ""}`}>
            <input
              type="text"
              className={`form-control floating ${errors.employeeId ? "is-invalid" : ""}`}
              {...register("employeeId")}
            />
            <label className="focus-label">Employee ID</label>
            {errors.employeeId && <span className="text-danger">{errors.employeeId.message}</span>}
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className={`input-block form-focus ${errors.employeeName ? "focused" : ""}`}>
            <input
              type="text"
              className={`form-control floating ${errors.employeeName ? "is-invalid" : ""}`}
              {...register("employeeName")}
            />
            <label className="focus-label">Employee Name</label>
            {errors.employeeName && <span className="text-danger">{errors.employeeName.message}</span>}
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="input-block form-focus select-focus">
            <Controller
              name="designation"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={designationOptions}
                  placeholder="Select Designation"
                  styles={customStyles}
                />
              )}
            />
            <label className="focus-label">Designation</label>
            {errors.designation && <span className="text-danger">{errors.designation.message}</span>}
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <button type="submit" className="btn btn-success btn-block w-100">
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default EmployeeListFilter;
