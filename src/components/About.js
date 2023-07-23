export default function About() {
  return (
    <>
      <h1>About FEC Client</h1>
      <p>
        Hello and welcome to my Federal Election Commission Client! I started
        this app so I could better understand the political landscape across the
        US. To that end I created an individual contribution search that better
        met my needs and purposes than the{" "}
        <a href="https://www.fec.gov/data/receipts/individual-contributions">
          tool available from the FEC
        </a>
        .
      </p>
      <h2>Why?</h2>
      <p>
        The FEC's individual contribution search is slow, presents 30 results
        per page by default, and doesn't collate contributions from the same
        donor. Many people donate to campaign committees on a regular basis so
        it was frustrating to page through their system to find out how much
        each donor gives to each campaign.
      </p>
      <p>
        Moreover, I wanted to be able to understand how the employees of
        specific companies donate to political campaigns, and how those
        contributions break down according to geographic location and
        occupation. Some of this information can be found through{" "}
        <a href="https://www.opensecrets.org">OpenSecrets</a>, but I found that
        they only supplied information regarding donations over $200 (based on
        the FEC’s bulk data downloads). This was a problem because a lot of
        individuals don’t have that much money to donate and even among those
        who do, as mentioned above, many donate amounts slightly smaller than
        that limit on a regular basis.
      </p>
      <p>
        For these reasons I charted the amount donated to each campaign based on
        the supplied search queries and created tables of donations to these
        committees with each row pertaining to a single individual, with
        donation amounts summed up into a single value.
      </p>
      <h2>How?</h2>
      <p>
        The FEC has generously supplied{" "}
        <a href="https://api.open.fec.gov/developers/">an API</a> for developers
        to search the data they have available. I’ve created a back-end service
        hosted on PythonAnywhere to query their API and serve the results to
        this app on github pages. You can review the client code{" "}
        <a href="https://www.github.com/joshuaism/react-fec-client">here</a>.
      </p>
    </>
  );
}
