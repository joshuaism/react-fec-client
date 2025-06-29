import { useState } from "react";
import { YEARS } from "../constants";
import ndjsonStream from "can-ndjson-stream";
import qs from "qs";

export const REQUEST_STATUS = {
  LOADING: "loading",
  PROCESSING: "processing",
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
    fromYear = fromYear ? fromYear : 2026;
    toYear = toYear ? toYear : 2026;
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
    const committees = [];
    Object.keys(formData)
      .filter((key) => committeeTypes.includes(key))
      .forEach((key) => {
        if (formData[key] !== true) return;
        if (key === "other" && formData[key] === true) {
          committees.push(...otherCommitteeTypes);
          return;
        }
        committees.push(key);
      });

    const yearparams = getYearParams(formData.from_year, formData.to_year);

    let massagedFormData = { ...formData };
    massagedFormData.committee_type = committees;
    delete massagedFormData.to_year;
    delete massagedFormData.from_year;
    delete massagedFormData.p;
    delete massagedFormData.s;
    delete massagedFormData.h;
    delete massagedFormData.other;

    const queryparams = qs.stringify(massagedFormData, {
      skipNulls: true,
      arrayFormat: "repeat",
      filter: (prefix, value) => value || undefined,
    });

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
      setError("");
      try {
        const response = await fetch(requestUrl);
        const ndjson = ndjsonStream(response.body);
        const reader = ndjson.getReader();
        let result = [];
        let count = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          if (value.message) {
            throw new Error(value.message);
          }
          result = [value, ...result];
          count = count + value.results.length;
          console.log(`loading ${count} of ${value.pagination.count} records`);
          setRequestStatus(`loading ${count} of ${value.pagination.count} records`);
        }
        reader.releaseLock();

        setRequestStatus(REQUEST_STATUS.PROCESSING);
        const collectedObject = result.reduce((collector, object) => {
          collector.pagination = object.pagination;
          collector.results = [...collector.results, ...object.results];
          return collector;
        });
        const uniqueContributorCommitteePairMap = new Map();
        collectedObject.results = collectedObject.results.map((c, i) => {
          if (c.committee == null) {
            console.log(c);
          }
          const key = `${c.fullName} ${c.address} ${c.city} ${c.state} ${c.committee ? c.committee.id : ""} ${
            c.earmark
          } ${c.employer} ${c.occupation}`;
          const aggregate = uniqueContributorCommitteePairMap.get(key);
          c.id = i;
          c.key = key;
          if (aggregate) {
            aggregate.date = null;
            aggregate.amount += c.amount;
            aggregate.count += 1;
          } else {
            c.count = 1;
            uniqueContributorCommitteePairMap.set(key, c);
          }
          return c;
        });
        collectedObject.results = Array.from(uniqueContributorCommitteePairMap.values());
        collectedObject.pairMap = uniqueContributorCommitteePairMap;
        setData(collectedObject);
        const groupedObjects = groupBy(collectedObject.results, "fullName");
        setGroups(groupedObjects);
        setRequestStatus(REQUEST_STATUS.SUCCESS);
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
