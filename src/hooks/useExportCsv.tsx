// utils/csvExporter.ts
export function exportToCSV(data: any[], fileName: string) {
  // Remove the "id" field from each row
  const filteredData = data.map((row) => {
    const { _id,__v, ...rest } = row; // Destructure and remove "id"
    return rest;
  });

  // CSV headers from the keys of the first row of filtered data
  const headers = Object.keys(filteredData[0] || {}).join(",");

  // Map rows, escaping values and joining by commas
  const rows = filteredData
    .map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`) // Escape values
        .join(",")
    )
    .join("\n");

  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
