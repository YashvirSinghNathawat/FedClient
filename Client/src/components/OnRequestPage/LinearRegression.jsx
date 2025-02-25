import React from "react";
import TestMetricsMultiselect from "../OnWholeApp/helperFunctions";

/*
Checks/validation can be included in the component later as these do not involve changing something out of this file...
This can be done by simply implementing the validation schema and Resolvers from react-hook-form to link the
checks mentioned in the schema

schema of this component (model_info obj generated by this component):

==================================================
sample model_info object:

  "model_info": {
    "lr": 0.01,
    "n_iters": 100
  }

==================================================
*/

const LinearRegression = ({ control, register }) => {
  const defaultValues = {
    lr: 0.01,
    n_iters: 1,
  };

  // Start of model_info component
  return (
    <div>
      <p>Configure the Linear Regression model parameters below:</p>

      {/* Learning Rate */}
      <div className="input-group mb-3">
        <span className="input-group-text">Learning Rate</span>
        <input
          type="number"
          className="form-control"
          step="0.01"
          placeholder="e.g. 0.01"
          defaultValue={defaultValues.lr}
          {...register("model_info.lr")}
        />
      </div>

      {/* Number of Iterations */}
      <div className="input-group mb-3">
        <span className="input-group-text">Number of Iterations</span>
        <input
          type="number"
          className="form-control"
          placeholder="e.g. 1"
          defaultValue={defaultValues.n_iters}
          {...register("model_info.n_iters")}
        />
      </div>

      {/* Select test metrics */}
      <TestMetricsMultiselect register={register} />
    </div>
  );
};

export default LinearRegression;
