import { useState } from "react";
import { YEARS } from "../constants";
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

const restUrl = "https://joshuaism.pythonanywhere.com/react/?";
//const restUrl = "http://127.0.0.1:8000/react/?";

const committeeTypes = ["p", "s", "h", "other"];
const otherCommitteeTypes = ["c", "d", "e", "i", "n", "o", "q", "u", "v", "w", "x", "y", "z"];

function useContributionService() {
  const [data, setData] = useState();
  const [groups, setGroups] = useState();
  const [requestStatus, setRequestStatus] = useState("");
  const [error, setError] = useState("");

  function getYearParams(fromYear, toYear) {
    fromYear = fromYear ? fromYear : 2024;
    toYear = toYear ? toYear : 2024;
    if (fromYear > toYear) {
      fromYear = toYear;
    }
    return YEARS.filter((year) => year >= fromYear && year <= toYear)
      .map((year) => {
        return `cycle=${year}`;
      })
      .join("&");
  }

  function getRequestUrl(formData) {
    const queryparams = Object.keys(formData)
      .filter((key) => formData[key] && formData[key] !== "")
      .filter((key) => key !== "from_year" && key !== "to_year")
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

    const yearparams = getYearParams(formData.from_year, formData.to_year);

    if (queryparams && yearparams) return `${restUrl}${queryparams}&${yearparams}`;
    if (queryparams) return `${restUrl}${queryparams}`;
    if (yearparams) return `${restUrl}${yearparams}`;
    return "";
  }

  function searchContributions(formData) {
    const requestUrl = getRequestUrl(formData);
    if (requestUrl === "") {
      throw error;
    }
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
        collectedObject.results = collectedObject.results.map((contribution) => {
          contribution.id = `${contribution.fullName} ${contribution.address} ${contribution.city} ${contribution.state} ${contribution.committee.id} ${contribution.earmark} ${contribution.amount} ${contribution.date}`;
          return contribution;
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
