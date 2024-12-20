// utils/csvExporter.ts
export function exportToCSV(data: any[], fileName: string) {
  const headers = Object.keys(data[0] || {}).join(","); // CSV headers
  const rows = data
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
