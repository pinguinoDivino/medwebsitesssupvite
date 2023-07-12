import styles from "./index.module.css";

const Table = ({ className, header, data, keyID }) => {
  const getValue = (headerItem, item) => {
    const val = headerItem.nestedValue
      ? item[headerItem.value][headerItem.nestedValue]
      : item[headerItem.value];
    if (!val) {
      return "Non disponibile";
    }
    return headerItem.func ? headerItem.func(val, item) : val;
  };
  return (
    <div className={`${styles["table-container"]} ${className}`}>
      <table>
        <thead>
          <tr>
            <th> #</th>
            {header.map((item) => (
              <th key={item.label}>{item.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item[keyID]}>
              <td>{index + 1}</td>
              {header.map((headerItem) => (
                <td key={headerItem.value}>{getValue(headerItem, item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
