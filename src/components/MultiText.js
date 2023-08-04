export default function MultiText({ label, inputFields, setInputFields, max = 10 }) {
  function handleFormChange(event, index) {
    let data = [...inputFields];
    data[index][label] = event.target.value;
    setInputFields(data);
  }

  function addFields(event) {
    event.preventDefault();
    let object = {
      [label]: "",
    };

    setInputFields([...inputFields, object]);
  }

  function removeFields(event, index) {
    event.preventDefault();
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  }

  function populateAddButton(index) {
    return index === inputFields.length - 1 && inputFields[index][label] !== "" && index < max - 1;
  }

  return (
    <>
      {inputFields.map((field, index) => {
        return (
          <div key={`${label}_${index}`}>
            <label>
              {index > 0 ? `${label} #${index + 1}: ` : `${label}: `}
              <input name={label} onChange={(event) => handleFormChange(event, index)} value={field[label]} />
            </label>
            {inputFields.length > 1 ? <button onClick={(event) => removeFields(event, index)}>-</button> : null}
            {populateAddButton(index) ? <button onClick={addFields}>+</button> : null}
          </div>
        );
      })}
    </>
  );
}
