import { useState } from "react";
import { REQUEST_STATUS } from "../hooks/useContributionService";
import { groupBy } from "../hooks/useContributionService";
import ContributionGroupCard from "./ContributionGroupCard";

export default function ContributionSearchResults({ data, groups, setGroups, requestStatus, error }) {
  const [activeCard, setActiveCard] = useState("all");
  if (requestStatus === "") return null;
  if (requestStatus === REQUEST_STATUS.LOADING) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <h1>Something went wrong</h1>;
  }

  function onChangeValue(e) {
    if (e.target.value === "committee") {
      const newGroups = data.results.reduce(function (rv, x) {
        (rv[x["committee"].name] = rv[x["committee"].name] || []).push(x);
        return rv;
      }, {});
      setGroups(newGroups);
    } else {
      setGroups(groupBy(data.results, e.target.value));
    }
    setActiveCard("all");
  }

  function onChangeCard(e) {
    setActiveCard(e.target.value);
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
        <input type="radio" value="committee" name="group" onChange={(e) => onChangeValue(e)}></input>
        committee
      </label>
      <label>
        <input type="radio" value="two_year_transaction_period" name="group" onChange={(e) => onChangeValue(e)}></input>
        year
      </label>
      <h1>Contributions</h1>
      <p>
        Returned {data.results.length} of {data.pagination.count} records
      </p>

      <label>
        <input type="radio" value="all" name="card" onChange={(e) => onChangeCard(e)} defaultChecked></input>
        all
      </label>

      {Object.keys(groups)
        .sort()
        .map((group) => {
          return (
            <label>
              <input type="radio" value={group} name="card" onChange={(e) => onChangeCard(e)}></input>
              {group}
            </label>
          );
        })}

      {Object.keys(groups)
        .sort()
        .filter((group) => {
          if (activeCard === "all") return true;
          return group === activeCard;
        })
        .map((group) => {
          return (
            <div>
              <h3>{group}</h3>
              <ContributionGroupCard key={group} group={groups[group]} />
            </div>
          );
        })}
    </div>
  );
}
