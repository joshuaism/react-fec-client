import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Link to="/">Contribution Search</Link> |&nbsp;
      <Link to="/outside-spending">Outside Spending Search</Link> |&nbsp;
      <Link to="/about">About</Link>
    </>
  );
}
