import { useState, useEffect } from "react";
import axios from "axios";

export const REQUEST_STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  FAILURE: "failure",
};

export function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

const restUrl = "https://joshuaism.pythonanywhere.com/scheduleA/?";
//const restUrl = "http://127.0.0.1:8000/scheduleA/?";

const committeeTypes = ["p", "s", "h", "other"];
const otherCommitteeTypes = ["c", "d", "e", "i", "n", "o", "q", "u", "v", "w", "x", "y", "z"];

function useContributionService() {
  const [data, setData] = useState();
  const [groups, setGroups] = useState();
  const [requestStatus, setRequestStatus] = useState("");
  const [error, setError] = useState("");

  /*useEffect(
    () => {
      searchContributions();
    },
    [] // use an empty array here so it only runs the first time the component renders
  );*/

  function searchContributions(formData) {
    const queryparams = Object.keys(formData)
      .filter((key) => formData[key] && formData[key] !== "")
      .map((key) => {
        if (committeeTypes.includes(key)) {
          if (key === "other") {
            return otherCommitteeTypes.map((type) => `committee_type=${type}`).join("&");
          }
          return `committee_type=${key}`;
        }
        return `${key}=${formData[key]}`;
      })
      .join("&");

    const requestUrl = `${restUrl}${queryparams}`;
    async function makeRequest() {
      setRequestStatus(REQUEST_STATUS.LOADING);
      try {
        const result = await axios.get(requestUrl);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
        const collectedObject = result.data.reduce((collector, object) => {
          collector.pagination = object.pagination;
          collector.results = [...collector.results, ...object.results];
          return collector;
        });
        setData(collectedObject);
        const groupedObjects = groupBy(collectedObject.results, "fullName");
        setGroups(groupedObjects);
      } catch (e) {
        setRequestStatus(REQUEST_STATUS.FAILURE);
        setError(e);
      }
    }
    makeRequest();
  }

  return { data, groups, setGroups, requestStatus, error, searchContributions };
}

export default useContributionService;
