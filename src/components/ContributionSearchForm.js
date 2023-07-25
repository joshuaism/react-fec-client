import { useState } from "react";
import { STATES, YEARS } from "../constants";

export default function ContributionSearchForm({ searchContributions }) {
  const [data, setData] = useState({});
  const [toYear, setToYear] = useState(2024);
  const [fromYear, setFromYear] = useState(2024);

  function updateData(e) {
    //console.log(`updating ${e.target.name} to ${e.target.value}`);
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function updateCheckbox(e) {
    //console.log(`updating ${e.target.name} to ${e.target.checked}`);
    setData({ ...data, [e.target.name]: e.target.checked });
  }

  function updateFromYear(event) {
    const { target } = event;
    setFromYear(target.value);
    if (target.value > toYear) {
      setToYear(target.value);
      setData({ ...data, [target.name]: target.value, ["to_year"]: target.value });
    } else {
      updateData(event);
    }
  }

  function updateToYear(event) {
    const { target } = event;
    setToYear(target.value);
    if (target.value < fromYear) {
      setFromYear(target.value);
      setData({ ...data, [target.name]: target.value, ["from_year"]: target.value });
    } else {
      updateData(event);
    }
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
      <label>
        From:
        <select name="from_year" value={fromYear} onChange={updateFromYear}>
          {YEARS.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
      <label>
        To:
        <select name="to_year" value={toYear} onChange={updateToYear}>
          {YEARS.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
      <button type="reset">Clear Form</button>
      <button type="submit">Submit</button>
    </form>
  );
}
