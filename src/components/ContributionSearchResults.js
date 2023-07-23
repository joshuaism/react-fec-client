import { REQUEST_STATUS } from "../hooks/useContributionService";
import { groupBy } from "../hooks/useContributionService";
import { v4 as uuid } from "uuid";

function ContributionGroup({ group }) {
  return group.map((contribution) => {
    return <Contribution key={uuid()} contribution={contribution} />;
  });
}

function Contribution({ contribution }) {
  const { fullName, city, state, employer, occupation, amount, committee, date } = contribution;
  return (
    <div>
      <p>
        {fullName}|{city}, {state}|{employer}|{occupation}|{amount}|{committee ? committee.name : "empty"}|{date}
      </p>
    </div>
  );
}

export default function ContributionSearchResults({ data, groups, setGroups, requestStatus, error }) {
  if (requestStatus === "") return null;
  if (requestStatus === REQUEST_STATUS.LOADING) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <h1>Something went wrong</h1>;
  }

  function onChangeValue(e) {
    console.log(e.target.value);
    setGroups(groupBy(data.results, e.target.value));
  }

  return (
    <div>
      <label>
        <input type="radio" value="fullName" name="group" onChange={(e) => onChangeValue(e)} defaultChecked></input>
        fullName
      </label>
      <label>
        <input type="radio" value="employer" name="group" onChange={(e) => onChangeValue(e)}></input>
        employer
      </label>
      <label>
        <input type="radio" value="occupation" name="group" onChange={(e) => onChangeValue(e)}></input>
        occupation
      </label>
      <h1>Contributions</h1>
      <p>
        Returned {data.results.length} of {data.pagination.count} records
      </p>

      {Object.keys(groups).map((group) => {
        return (
          <div>
            <h3>{group}</h3>
            <ContributionGroup key={uuid()} group={groups[group]} />
          </div>
        );
      })}
    </div>
  );
}
