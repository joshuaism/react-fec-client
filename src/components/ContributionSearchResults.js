import { useState } from "react";
import { REQUEST_STATUS } from "../hooks/useContributionService";
import { groupBy } from "../hooks/useContributionService";
import ContributionGroupCards from "./ContributionGroupCards";

export default function ContributionSearchResults({ data, groups, setGroups, requestStatus, error }) {
  const [grouping, setGrouping] = useState("fullName");
  if (requestStatus === "") return null;
  if (requestStatus.toLowerCase().startsWith("loading")) return <p>{requestStatus}...</p>;
  if (requestStatus === REQUEST_STATUS.PROCESSING) return <p>processing results</p>;
  if (error) {
    console.log(error);
    return (
      <div>
        <h1>Something went wrong</h1>
        <p class="error">{error.toString()}</p>
      </div>
    );
  }

  function onChangeValue(e) {
    setGrouping(e.target.value);
    if (e.target.value === "committee") {
      const newGroups = data.results.reduce(function (rv, x) {
        const key = x["committee"] ? x["committee"].name : "unknown";
        (rv[key] = rv[key] || []).push(x);
        return rv;
      }, {});
      setGroups(newGroups);
    } else {
      setGroups(groupBy(data.results, e.target.value));
    }
  }

  return (
    <div>
      <label>
        <input type="radio" value="fullName" name="group" onChange={(e) => onChangeValue(e)} defaultChecked></input>
        name
      </label>
      <label>
        <input type="radio" value="employer" name="group" onChange={(e) => onChangeValue(e)}></input>
        employer
      </label>
      <label>
        <input type="radio" value="occupation" name="group" onChange={(e) => onChangeValue(e)}></input>
        occupation
      </label>
      <label>
        <input type="radio" value="state" name="group" onChange={(e) => onChangeValue(e)}></input>
        state
      </label>
      <label>
        <input type="radio" value="committee" name="group" onChange={(e) => onChangeValue(e)}></input>
        committee
      </label>
      <label>
        <input type="radio" value="two_year_transaction_period" name="group" onChange={(e) => onChangeValue(e)}></input>
        year
      </label>
      <a id="top"></a>
      <h1>Contributions</h1>
      <p>
        Returned {data.results.reduce((counter, contribution) => (counter += contribution.count), 0)} of{" "}
        {data.pagination.count} records
      </p>
      <ContributionGroupCards key={grouping} groups={groups} />
    </div>
  );
}
