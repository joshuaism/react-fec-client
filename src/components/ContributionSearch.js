import useContributionService from "../hooks/useContributionService";
import ContributionSearchForm from "./ContributionSearchForm";
import ContributionSearchResults from "./ContributionSearchResults";

export default function ContributionSearch() {
  const { data, requestStatus, error, searchContributions } =
    useContributionService();

  return (
    <>
      <h1>FEC Political Contribution Search</h1>
      <ContributionSearchForm searchContributions={searchContributions} />
      <ContributionSearchResults
        data={data}
        requestStatus={requestStatus}
        error={error}
      />
    </>
  );
}
