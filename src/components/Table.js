import { useSortableTable } from "../hooks/useSortableTable";
import TableBody from "./TableBody";
import TableHead from "./TableHead";

const Table = ({ caption, data, columns, rowClassOverride }) => {
  const [tableData, handleSorting] = useSortableTable(data, columns);

  return (
    <>
      <table className="table">
        <caption>{caption}</caption>
        <TableHead {...{ columns, handleSorting }} />
        <TableBody {...{ columns, tableData, rowClassOverride }} />
      </table>
    </>
  );
};

export default Table;
