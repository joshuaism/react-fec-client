import Table from "./Table";
import { sortOnField } from "../hooks/useSortableTable";

const columns = [
  { label: "Name", accessor: "fullName", sortable: true },
  { label: "Location", accessor: "city", customSort: sortByLocation, replacement: asLocation, sortable: true },
  { label: "Employer", accessor: "employer", sortable: true },
  { label: "Occupation", accessor: "occupation", sortable: true },
  { label: "Committee", accessor: "committee", customSort: sortByCommittee, replacement: asCommittee, sortable: true },
  { label: "Amount", accessor: "amount", decorator: asMoney, sortable: true },
  { label: "Date", accessor: "date", decorator: asDate, sortable: true },
];

function sortByCommittee(a, b) {
  if (a.committee.name !== b.committee.name) {
    return sortOnField(a.committee, b.committee, "name");
  }
  return sortOnField(a, b, "earmark");
}

function sortByLocation(a, b) {
  if (a.state !== b.state) {
    return sortOnField(a, b, "state");
  }
  return sortOnField(a, b, "city");
}

function asLocation(contribution) {
  const { address, city, state } = contribution;
  return (
    <span title={address}>
      {city}, {state}
    </span>
  );
}

function asCommittee(contribution) {
  const { earmark, committee } = contribution;
  return <span title={earmark}>{committee.name}</span>;
}

function asMoney(field) {
  return parseFloat(field).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function asDate(field) {
  return new Date(field).toLocaleDateString("en-US");
}

export default function ContributionGroupCard({ header, group }) {
  return <Table caption={header} data={group} columns={columns} />;
}

function Contribution({ contribution }) {
  const { fullName, address, city, state, employer, occupation, amount, committee, date } = contribution;
  const dateString = new Date(date).toLocaleDateString("en-US");
  const amountString = parseFloat(amount).toLocaleString("en-US", { style: "currency", currency: "USD" });
  return (
    <tr className={getParty(committee)}>
      <td>{fullName}</td>
      <td>
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
  return <span title={earmark}>{committee.name}</span>;
}
