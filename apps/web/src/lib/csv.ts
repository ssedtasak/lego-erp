/**
 * CSV Export Utilities - RFC 4180 compliant with formula injection prevention
 */

/**
 * Prevent formula injection by prefixing values starting with dangerous chars
 * = + - @ \t \r at the start of a cell can be interpreted as formulas in Excel/Sheets
 */
function preventFormulaInjection(value: string): string {
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Escape a CSV field according to RFC 4180
 * - Wrap in double quotes if contains comma, double quote, or newline
 * - Escape internal double quotes as ""
 */
function escapeCSVField(value: string): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Export data to CSV file with proper escaping and UTF-8 BOM for Thai support
 */
export function exportToCSV<T>(
  headers: string[],
  rows: T[][],
  filename: string
): void {
  const escapedHeaders = headers.map(h => escapeCSVField(h));
  const escapedRows = rows.map(row => row.map(cell => {
    const str = String(cell ?? '');
    return escapeCSVField(preventFormulaInjection(str));
  }));

  const csv = [escapedHeaders, ...escapedRows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
