import { useState } from "react";
import { STATES, YEARS } from "../constants";
import { useQueryState } from "../hooks/useQueryState";
import MultiText from "./MultiText";

export default function ContributionSearchForm({ searchContributions }) {
  const [queryData, setQueryData] = useQueryState();
  const [data, setData] = useState(queryData);
  const [toYear, setToYear] = useState(queryData.to_year ? queryData.to_year : 2024);
  const [fromYear, setFromYear] = useState(queryData.from_year ? queryData.from_year : 2024);

  const [nameFields, setNameFields] = useState(populateField(queryData, "name"));
  const [employerFields, setEmployerFields] = useState(populateField(queryData, "employer"));
  const [occupationFields, setOccupationFields] = useState(populateField(queryData, "occupation"));
  const [cityFields, setCityFields] = useState(populateField(queryData, "city"));
  const [committeeFields, setCommitteeFields] = useState(populateField(queryData, "committee"));

  function populateField(queryData, fieldName) {
    if (queryData[fieldName]) {
      return queryData[fieldName].map((v) => {
        return { [fieldName]: v };
      });
    }
    return [{ [fieldName]: "" }];
  }

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
    setQueryData({});
    setFromYear(2024);
    setToYear(2024);
    setNameFields([{ name: "" }]);
    setEmployerFields([{ employer: "" }]);
    setOccupationFields([{ occupation: "" }]);
    setCityFields([{ city: "" }]);
    setCommitteeFields([{ committee: "" }]);
    console.log("cleared form");
  }

  function handleSubmit(event) {
    event.preventDefault();
    data.name = multiTextToArray(nameFields, "name");
    data.employer = multiTextToArray(employerFields, "employer");
    data.occupation = multiTextToArray(occupationFields, "occupation");
    data.city = multiTextToArray(cityFields, "city");
    data.committee = multiTextToArray(committeeFields, "committee");
    setQueryData(data);
    searchContributions(data);
  }

  function multiTextToArray(fields, fieldName) {
    const arr = [];
    fields.forEach((obj) => {
      if (obj[fieldName] === "") return;
      arr.push(obj[fieldName]);
    });
    return arr;
  }

  return (
    <div>
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
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <MultiText label="name" inputFields={nameFields} setInputFields={setNameFields} />
        <MultiText label="employer" inputFields={employerFields} setInputFields={setEmployerFields} />
        <MultiText label="occupation" inputFields={occupationFields} setInputFields={setOccupationFields} />
        <MultiText label="city" inputFields={cityFields} setInputFields={setCityFields} />
        <label>
          State:
          <select name="state" defaultValue={queryData.state} onChange={updateData}>
            <option value="" key=""></option>
            {STATES.map((state) => (
              <option value={state} key={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <MultiText label="committee" inputFields={committeeFields} setInputFields={setCommitteeFields} />
        <label>
          <input type="checkbox" name="p" defaultChecked={queryData.p} onChange={updateCheckbox}></input>
          President
        </label>
        <label>
          <input type="checkbox" name="s" defaultChecked={queryData.s} onChange={updateCheckbox}></input>
          Senate
        </label>
        <label>
          <input type="checkbox" name="h" defaultChecked={queryData.h} onChange={updateCheckbox}></input>
          House
        </label>
        <label>
          <input type="checkbox" name="other" defaultChecked={queryData.other} onChange={updateCheckbox}></input>
          Other
        </label>
        <button type="reset">Clear Form</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
