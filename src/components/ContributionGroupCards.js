import { useState } from "react";
import BarChart from "./BarChart";
import ContributionGroupCard from "./ContributionGroupCard";

export default function ContributionGroupCards({ groups }) {
  const [activeCards, setActiveCards] = useState(Object.keys(groups));

  function showAll() {
    setActiveCards(Object.keys(groups).sort());
  }

  function clearAll() {
    setActiveCards([]);
  }

  function toggleCard(e) {
    if (e.target.checked) {
      setActiveCards([...activeCards, e.target.name].sort());
    } else {
      const newActiveCards = activeCards.filter((card) => card !== e.target.name);
      setActiveCards(newActiveCards.sort());
    }
  }

  return (
    <>
      <div>
        Showing{" "}
        {Object.keys(groups)
          .filter((group) => activeCards.includes(group))
          .reduce((counter, group) => {
            const count = groups[group].reduce((counter, contribution) => (counter += contribution.count), 0);
            return (counter += count);
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
          <BarChart groups={groups} labels={activeCards} />
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
