function formatData(data, decorator) {
  if (data) {
    if (decorator) {
      return decorator(data);
    }
    return data;
  }
  return "——";
}

const TableBody = ({ tableData, columns }) => {
  return (
    <tbody>
      {tableData.map((data) => {
        return (
          <tr key={data.id}>
            {columns.map(({ accessor, decorator }) => {
              const tData = formatData(data[accessor], decorator);
              //const tData = data[accessor][field] ? data[accessor][field] : data[accessor] ? data[accessor] : "——";

              return <td key={accessor}>{tData}</td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
