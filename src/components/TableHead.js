import { useState } from "react";

const TableHead = ({ columns, handleSorting }) => {
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSortingChange = (accessor, customSort) => {
    const sortOrder = accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder, customSort);
  };

  return (
    <thead>
      <tr>
        {columns.map(({ label, accessor, sortable, customSort }) => {
          const cl = sortable
            ? sortField === accessor && order === "asc"
              ? "up"
              : sortField === accessor && order === "desc"
              ? "down"
              : "default"
            : "";
          return (
            <th
              className={cl}
              key={accessor}
              onClick={sortable ? () => handleSortingChange(accessor, customSort) : null}
            >
              {label}{" "}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
