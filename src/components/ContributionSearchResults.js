import { REQUEST_STATUS } from "../hooks/useContributionService";
import { v4 as uuid } from "uuid";

function Contribution({ contribution }) {
  const {
    fullName,
    city,
    state,
    employer,
    occupation,
    amount,
    committee,
    date,
  } = contribution;
  return (
    <div>
      <p>
        {fullName}|{city}, {state}|{employer}|{occupation}|{amount}|
        {committee ? committee.name : "empty"}|{date}
      </p>
    </div>
  );
}

export default function ContributionSearchResults({
  data,
  requestStatus,
  error,
}) {
  if (requestStatus === "") return null;
  if (requestStatus === REQUEST_STATUS.LOADING) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <h1>Something went wrong</h1>;
  }

  console.log(data);
  return (
    <>
      <h1>Contributions</h1>
      <p>
        Returned {data.results.length} of {data.pagination.count} records
      </p>
      {data.results.map((contribution) => {
        return <Contribution key={uuid()} contribution={contribution} />;
      })}
    </>
  );
}
