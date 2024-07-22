import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGlobalData } from "../GlobalContext";
import Error from "../Pages/Error";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const get_training_endpoint = `http://localhost:8000/get-federated-session/${sessionId}`;
const client_response_endpoint =
  "http://localhost:8000/submit-client-federated-response";

// Recursive component to render any type of data
const RenderData = ({ data, level = 0 }) => {
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      return (
        <ul className="list-group ms-3">
          {data.map((item, index) => (
            <li className="list-group-item" key={index}>
              <RenderData data={item} level={level + 1} />
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <div className="ms-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key}:</strong>
              <RenderData data={value} level={level + 1} />
            </div>
          ))}
        </div>
      );
    }
  } else {
    return <span className="ms-3">{data?.toString()}</span>;
  }
};

export default function TrainingDetails({ clientToken }) {
  const [config, setConfig] = useState(null); // delete later, just to test training
  const { sessionId } = useParams();
  const [federatedSessionData, setFederatedSessionData] = useState({});

  const { register, handleSubmit } = useForm();
  // Finding the training object of the id in the URL path
  // const training = GlobalData.CurrentModels.find(
  //   (item) => item.RequestId === id
  // );

  // if (!training) {
  //   return <Error />;
  // }

  // ============================================================================
  /* Code to be used to trigger training... "config" state ans setconfig
   is also associated with this, delete that (and uses too) while deleting this */
  const train_model = async (config) => {
    console.log(config);
    const model_send_url = "http://localhost:9000/initiate-model";
    const training_start_url = "http://localhost:9000/execute-round";

    const res = await axios.post(model_send_url, config.data.federated_info); // config.data because of axios
    if (res.status === 200) {
      console.log(res.data.message);
    } else {
      console.error("Failed to send model config to private server", res);
    }

    const training_verbose = await axios.get(training_start_url);
    if (training_verbose.status === 200) {
      console.log("output:", training_verbose.data.stdout);
      console.log("stderr:", training_verbose.data.stderr);
      console.log("returncode:", training_verbose.data.returncode);
    } else {
      console.error("Failed to start the execution on the private server", res);
    }
  };

  const handleButtonClick = () => {
    train_model(config);
  };
  // ==========================================================================

  const fetchFederatedSessionData = async (clientId) => {
    try {
      const params = {
        client_id: clientId,
      };
      const res = await axios.get(get_training_endpoint, { params });
      console.log(res.data);
      setFederatedSessionData(res.data);
      setConfig(res); // to be deleted
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  useEffect(() => {
    fetchFederatedSessionData(clientToken);
  }, [clientToken]);

  // Function to determine status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1:
        return "badge bg-secondary";
      case 2:
        return "badge bg-warning";
      default:
        return "badge bg-success";
    }
  };

  const onSubmit = async (data) => {
    console.log(data.decision);
    const requestData = {
      client_id: clientToken,
      session_id: sessionId,
      decision: data.decision == "accepted" ? 1 : 0,
    };
    console.log(requestData.decision, typeof requestData.decision);
    try {
      console.log(requestData);
      const res = await axios.post(client_response_endpoint, requestData);
      if (res.status === 200) {
        // Client Background Task --> Save the session token in the use State have to implement logic in backend
        console.log(res.data);
        fetchFederatedSessionData(clientToken);
      } else {
        console.error("Failed to submit the request:", res);
      }
    } catch (error) {
      console.error("Error submitting the request:", error);
    }
  };

  return clientToken ? (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header text-center bg-primary text-white">
          <h3>Training Details</h3>
        </div>
        <div className="card-body">
          {federatedSessionData &&
            Object.entries(federatedSessionData).map(([key, value]) => (
              <div key={key} className="mb-3">
                <h5 className="text-primary border-bottom pb-2">{key}</h5>
                {key.toLowerCase() === "training_status" ? (
                  <span className={getStatusBadgeClass(value)}>{value}</span>
                ) : (
                  <>
                    {value === 1 ? (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <label>
                          <input
                            type="radio"
                            value="accepted"
                            {...register("decision", { required: true })}
                          />
                          Accept
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="rejected"
                            {...register("decision", { required: true })}
                          />
                          Reject
                        </label>
                        <br />
                        <button type="submit">Submit Response</button>
                      </form>
                    ) : (
                      <RenderData data={value} />
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
      <button onClick={handleButtonClick}>Train</button>
    </div>
  ) : (
    <>LogInFirst</>
  );
}
