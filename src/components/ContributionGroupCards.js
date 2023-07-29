import { useState } from "react";
import ContributionGroupCard from "./ContributionGroupCard";

export default function ContributionGroupCards({ groups }) {
  const [activeCards, setActiveCards] = useState(Object.keys(groups));

  function showAll() {
    setActiveCards(Object.keys(groups));
  }

  function clearAll() {
    setActiveCards([]);
  }

  function toggleCard(e) {
    if (e.target.checked) {
      setActiveCards([...activeCards, e.target.name]);
    } else {
      const newActiveCards = activeCards.filter((card) => card !== e.target.name);
      setActiveCards(newActiveCards);
    }
  }

  return (
    <>
      <div>
        Showing{" "}
        {Object.keys(groups)
          .filter((group) => activeCards.includes(group))
          .reduce((counter, group) => {
            return (counter = counter + groups[group].length);
          }, 0)}{" "}
        records
      </div>
      <div>
        <div className="left-column">
          <div>
            <button name="show all" onClick={showAll}>
              Show All
            </button>
          </div>
          <div>
            <button name="clear all" onClick={clearAll}>
              clearAll
            </button>
          </div>
          {Object.keys(groups)
            .sort()
            .map((group) => {
              return (
                <div key={group}>
                  <label>
                    <input
                      type="checkbox"
                      name={group}
                      onChange={(e) => toggleCard(e)}
                      checked={activeCards.includes(group)}
                    ></input>
                    {group}
                  </label>
                </div>
              );
            })}
        </div>
        <div className="right-column">
          {Object.keys(groups)
            .sort()
            .filter((group) => activeCards.includes(group))
            .map((group) => {
              return <ContributionGroupCard key={group} header={group} group={groups[group]} />;
            })}
        </div>
      </div>
    </>
  );
}
