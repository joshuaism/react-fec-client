import { useState } from "react";

const STATES = [
  "AL",
  "AK",
  "AR",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WI",
  "WV",
  "WY",
  "AS",
  "GU",
  "MP",
  "PR",
  "UM",
  "VI",
  "AA",
  "AP",
  "AE",
];

export default function ContributionSearchForm({ searchContributions }) {
  const [data, setData] = useState({});

  function updateData(e) {
    //console.log(`updating ${e.target.name} to ${e.target.value}`);
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function updateCheckbox(e) {
    //console.log(`updating ${e.target.name} to ${e.target.checked}`);
    setData({ ...data, [e.target.name]: e.target.checked });
  }

  function handleReset() {
    setData({});
    console.log("cleared form");
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchContributions(data);
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <label>
        Name:
        <input type="text" name="name" onChange={updateData}></input>
      </label>
      <label>
        Employer:
        <input type="text" name="employer" onChange={updateData}></input>
      </label>
      <label>
        Occupation:
        <input type="text" name="occupation" onChange={updateData}></input>
      </label>
      <label>
        City:
        <input type="text" name="city" onChange={updateData}></input>
      </label>
      <label>
        State:
        <select name="state" onChange={updateData}>
          <option value="" key=""></option>
          {STATES.map((state) => (
            <option value={state} key={state}>
              {state}
            </option>
          ))}
        </select>
      </label>
      <label>
        Committee:
        <input type="text" name="committee" onChange={updateData}></input>
      </label>
      <label>
        <input type="checkbox" name="p" onChange={updateCheckbox}></input>
        President
      </label>
      <label>
        <input type="checkbox" name="s" onChange={updateCheckbox}></input>
        Senate
      </label>
      <label>
        <input type="checkbox" name="h" onChange={updateCheckbox}></input>
        House
      </label>
      <label>
        <input type="checkbox" name="other" onChange={updateCheckbox}></input>
        Other
      </label>
      <button type="reset">Clear Form</button>
      <button type="submit">Submit</button>
    </form>
  );
}
