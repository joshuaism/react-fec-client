import ear from "../images/ear.png";
import fec from "../images/fec.png";
import opensecrects from "../images/opensecrets.png";

export function getCommitteeName(earmark, committee) {
  const name = committee.name;
  if (committee.name === "ACTBLUE" || committee.name === "WINRED") {
    if (earmark.substring(0, 13) === "EARMARKED FOR") {
      return earmark.substring(14, earmark.lastIndexOf("(") - 1) + ` (${name})`;
    }
  }
  return name;
}

function getCommitteeId(earmark, committee) {
  if (committee.name === "ACTBLUE" || committee.name === "WINRED") {
    if (earmark.substring(0, 13) === "EARMARKED FOR") {
      return earmark.substring(earmark.lastIndexOf("(") + 1, earmark.lastIndexOf(")"));
    }
  }
  return committee.id;
}

export default function Committee({ contribution }) {
  const { earmark, two_year_transaction_period: cycle, committee } = contribution;

  const committeeName = getCommitteeName(earmark, committee);
  const committeeId = getCommitteeId(earmark, committee);
  return (
    <>
      {committeeName}&nbsp;&nbsp;
      {earmark ? (
        <span>
          <img className="icon" src={ear} title={earmark} alt={earmark} />
          &nbsp;&nbsp;
        </span>
      ) : null}
      <a
        target="_blank"
        title="FEC Committee Page"
        href={`https://www.fec.gov/data/committee/${committeeId}/?cycle=${cycle}`}
      >
        <img className="icon" src={fec} alt="FEC Committee Page" />
      </a>
      &nbsp;&nbsp;
      <a
        target="_blank"
        title="Open Secrets Committee Page"
        href={`https://www.opensecrets.org/pacs/lookup2.php?strID=${committeeId}&cycle=${cycle}`}
      >
        <img className="icon" src={opensecrects} alt="Open Secrets Committee Page" />
      </a>
    </>
  );
}
