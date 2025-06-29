import fec from "../images/fec.png";
import Table from "./Table";
import { sortOnField } from "../hooks/useSortableTable";
import { DEMOCRATIC, REPUBLICAN } from "../constants";
import Committee, { getCommitteeName } from "./Committee";

const columns = [
  { label: "Name", accessor: "fullName", replacement: asName, sortable: true },
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

function getIndividualContributionsLink(contribution) {
  let url = `https://www.fec.gov/data/receipts/`;
  let query = `?contributor_name=${contribution.fullName}&contributor_city=${contribution.city}&contributor_state=${contribution.state}&committee_id=${contribution.committee.id}`;
  if (contribution.employer) {
    query = query + `&contributor_employer=${contribution.employer}`;
  }
  if (contribution.occupation) {
    query = query + `&contributor_occupation=${contribution.occupation}`;
  }
  return url + query;
}

function asName(contribution) {
  return (
    <>
      {contribution.fullName}
      {"  "}
      <a target="_blank" title="FEC Contributor Search" href={getIndividualContributionsLink(contribution)}>
        <img className="icon" src={fec} alt="FEC Contributor Search" />
      </a>
    </>
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
  return (
    <>
      <a id={header}></a>
      <a href="#top">BACK TO TOP</a>
      <h2>{header}</h2>
      <div>Total Amount: {sumAmount(group)}</div>
      <div>Total Contributions: {group.reduce((sum, contribution) => sum + contribution.count, 0)}</div>
      <div>Total Unique Contributions: {group.length}</div>
      <Table data={group} columns={columns} rowClassOverride={getPartyStyle} />
    </>
  );
}

function sumAmount(group) {
  return asMoney(group.reduce((sum, contribution) => sum + contribution.amount, 0));
}

function getPartyStyle(contribution) {
  if (contribution.committee == null) {
    return "wrong";
  }
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
