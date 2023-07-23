import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Link to="/react-fec-client/">Contribution Search</Link> |&nbsp;
      <Link to="/react-fec-client/outside-spending">Outside Spending Search</Link> |&nbsp;
      <Link to="/react-fec-client/about">About</Link>
    </>
  );
}
