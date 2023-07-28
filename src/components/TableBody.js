function formatData(data, decorator) {
  if (data) {
    if (decorator) {
      return decorator(data);
    }
    return data;
  }
  return "——";
}

const TableBody = ({ tableData, columns, rowClassOverride }) => {
  return (
    <tbody>
      {tableData.map((data) => {
        return (
          <tr key={data.id}>
            {columns.map(({ accessor, decorator, replacement }) => {
              if (replacement) {
                return (
                  <td className={rowClassOverride ? rowClassOverride(data) : null} key={accessor}>
                    {replacement(data)}
                  </td>
                );
              }
              const tData = formatData(data[accessor], decorator);
              //const tData = data[accessor][field] ? data[accessor][field] : data[accessor] ? data[accessor] : "——";

              return (
                <td className={rowClassOverride ? rowClassOverride(data) : null} key={accessor}>
                  {tData}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
