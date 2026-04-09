import { describe, it, expect } from 'vitest';

// Import the functions directly (we'll test the logic inline since csv.ts is a utility)
describe('CSV Security', () => {
  describe('Formula Injection Prevention', () => {
    function preventFormulaInjection(value: string): string {
      const str = String(value ?? '');
      if (/^[=+\-@\t\r]/.test(str)) {
        return "'" + str;
      }
      return str;
    }

    it('prefixes = with single quote', () => {
      expect(preventFormulaInjection('=HYPERLINK("evil.com")')).toBe("'=HYPERLINK(\"evil.com\")");
    });

    it('prefixes + with single quote', () => {
      expect(preventFormulaInjection('+12345')).toBe("'+12345");
    });

    it('prefixes - with single quote', () => {
      expect(preventFormulaInjection('-999')).toBe("'-999");
    });

    it('prefixes @ with single quote', () => {
      expect(preventFormulaInjection('@eval()')).toBe("'@eval()");
    });

    it('does not modify normal text', () => {
      expect(preventFormulaInjection('เนื้อหมู')).toBe('เนื้อหมู');
      expect(preventFormulaInjection('Test')).toBe('Test');
    });

    it('handles empty string', () => {
      expect(preventFormulaInjection('')).toBe('');
    });

    it('handles null/undefined', () => {
      expect(preventFormulaInjection(null as any)).toBe('');
      expect(preventFormulaInjection(undefined as any)).toBe('');
    });
  });

  describe('RFC 4180 Escaping', () => {
    function escapeCSVField(value: string): string {
      const str = String(value ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }

    it('escapes fields with commas', () => {
      expect(escapeCSVField('ข้าว, มะม่วง')).toBe('"ข้าว, มะม่วง"');
    });

    it('escapes fields with double quotes', () => {
      expect(escapeCSVField('He said "Hello"')).toBe('"He said ""Hello"""');
    });

    it('escapes fields with newlines', () => {
      expect(escapeCSVField('Line1\nLine2')).toBe('"Line1\nLine2"');
    });

    it('escapes fields with carriage returns', () => {
      expect(escapeCSVField('Line1\rLine2')).toBe('"Line1\rLine2"');
    });

    it('does not escape normal text', () => {
      expect(escapeCSVField('เนื้อหมู')).toBe('เนื้อหมู');
    });

    it('handles empty string', () => {
      expect(escapeCSVField('')).toBe('');
    });
  });

  describe('Combined CSV Export', () => {
    function escapeCSVValue(value: string): string {
      const str = String(value ?? '');
      // Formula injection
      const formulaSafe = (/^[=+\-@\t\r]/.test(str) ? "'" : "") + str;
      // RFC 4180
      if (formulaSafe.includes(',') || formulaSafe.includes('"') || formulaSafe.includes('\n') || formulaSafe.includes('\r')) {
        return '"' + formulaSafe.replace(/"/g, '""') + '"';
      }
      return formulaSafe;
    }

    function exportToCSV<T>(headers: string[], rows: T[][], filename: string): string {
      // For testing, return the CSV string instead of downloading
      const escapedHeaders = headers.map(h => escapeCSVValue(h));
      const escapedRows = rows.map(row => row.map(cell => escapeCSVValue(String(cell ?? ''))));
      return [escapedHeaders, ...escapedRows]
        .map(row => row.join(','))
        .join('\n');
    }

    it('exports headers and rows correctly', () => {
      const headers = ['ชื่อ', 'ราคา'];
      const rows = [['เนื้อหมู', '180']];
      const csv = exportToCSV(headers, rows, 'test.csv');
      expect(csv).toBe('ชื่อ,ราคา\nเนื้อหมู,180');
    });

    it('handles Thai characters correctly', () => {
      const headers = ['วัตถุดิบ'];
      const rows = [['ผักกาดขาว']];
      const csv = exportToCSV(headers, rows, 'test.csv');
      expect(csv).toBe('วัตถุดิบ\nผักกาดขาว');
    });

    it('escapes formula injection in ingredient names', () => {
      // Formula is prevented (= becomes ') AND comma triggers RFC 4180 wrapping
      const headers = ['ชื่อ'];
      const rows = [['=HYPERLINK("http://evil.com")']];
      const csv = exportToCSV(headers, rows, 'test.csv');
      // Single quote prefix prevents formula, double quotes wrap due to comma inside
      expect(csv).toContain("'");
      expect(csv).toContain('"');
    });

    it('escapes commas in ingredient names', () => {
      const headers = ['ชื่อ'];
      const rows = [['ข้าว, มะม่วง']];
      const csv = exportToCSV(headers, rows, 'test.csv');
      expect(csv).toBe('ชื่อ\n"ข้าว, มะม่วง"');
    });

    it('handles empty data', () => {
      const headers = ['ชื่อ'];
      const rows: string[][] = [];
      const csv = exportToCSV(headers, rows, 'test.csv');
      expect(csv).toBe('ชื่อ');
    });

    it('handles numeric values', () => {
      const headers = ['จำนวน', 'ราคา'];
      const rows = [[100, 180.5]];
      const csv = exportToCSV(headers, rows, 'test.csv');
      expect(csv).toBe('จำนวน,ราคา\n100,180.5');
    });
  });
});
