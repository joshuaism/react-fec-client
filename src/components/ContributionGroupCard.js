import Table from "./Table";
import { sortOnField } from "../hooks/useSortableTable";
import { DEMOCRATIC, REPUBLICAN } from "../constants";
import Committee, { getCommitteeName } from "./Committee";

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
  const committeeA = getCommitteeName(a.earmark, a.committee);
  const committeeB = getCommitteeName(b.earmark, b.committee);
  if (committeeA !== committeeB) {
    if (committeeA == null) return 1;
    if (committeeB == null) return -1;
    if (committeeA == null && committeeB == null) return 0;
    return committeeA.toString().localeCompare(committeeB.toString(), "en", {
      numeric: true,
    });
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
  return <Committee contribution={contribution} />;
}

function asMoney(field) {
  return parseFloat(field).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function asDate(field) {
  return new Date(field).toLocaleDateString("en-US");
}

export default function ContributionGroupCard({ header, group }) {
  return <Table caption={header} data={group} columns={columns} rowClassOverride={getPartyStyle} />;
}

function getPartyStyle(contribution) {
  if (REPUBLICAN.includes(contribution.committee.name)) {
    return "republican";
  }
  if (DEMOCRATIC.includes(contribution.committee.name)) {
    return "democrat";
  }
  const party = contribution.committee.party;
  if (party.indexOf("DEMOCRATIC") > -1) return "democrat";
  if (party.indexOf("REPUBLICAN") > -1) return "republican";
  if (party.indexOf("LIBERTARIAN") > -1) return "libertarian";
  if (party.indexOf("GREEN") > -1) return "green";
  return "unknown";
}
