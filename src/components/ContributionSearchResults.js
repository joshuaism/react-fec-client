import { REQUEST_STATUS } from "../hooks/useContributionService";
import { groupBy } from "../hooks/useContributionService";
import { v4 as uuid } from "uuid";

function ContributionGroup({ group }) {
  return (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>location</th>
          <th>employer</th>
          <th>occupation</th>
          <th>committee</th>
          <th>amount</th>
          <th>date</th>
        </tr>
      </thead>
      <tbody>
        {group.map((contribution) => {
          return <Contribution key={uuid()} contribution={contribution} />;
        })}
      </tbody>
    </table>
  );
}

function Contribution({ contribution }) {
  const { fullName, address, city, state, employer, occupation, amount, committee, date } = contribution;
  const dateString = new Date(date).toLocaleDateString("en-US");
  const amountString = parseFloat(amount).toLocaleString("en-US", { style: "currency", currency: "USD" });
  return (
    <tr className={getParty(committee)}>
      <td>{fullName}</td>
      <td on>
        <span title={address}>
          {city}, {state}
        </span>
      </td>
      <td>{employer}</td>
      <td>{occupation}</td>
      <td>
        <Committee contribution={contribution} />
      </td>
      <td>{amountString}</td>
      <td>{dateString}</td>
    </tr>
  );
}

function getParty({ party }) {
  if (party.indexOf("DEMOCRATIC") > -1) return "democrat";
  if (party.indexOf("REPUBLICAN") > -1) return "republican";
  if (party.indexOf("LIBERTARIAN") > -1) return "libertarian";
  if (party.indexOf("GREEN") > -1) return "green";
}

function Committee({ contribution }) {
  const { earmark, committee } = contribution;
  if (earmark) {
    return <div>{earmark}</div>;
  }
  return <div>{committee.name}</div>;
}

export default function ContributionSearchResults({ data, groups, setGroups, requestStatus, error }) {
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

      {Object.keys(groups)
        .sort()
        .map((group) => {
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
