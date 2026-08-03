interface CsvParseOptions {
  delimiter?: string;
  hasHeader?: boolean;
  skipEmptyLines?: boolean;
}

function parseQuotedField(field: string): string {
  if (field.length < 2 || field[0] !== '"' || field[field.length - 1] !== '"') {
    return field;
  }
  return field.slice(1, -1).replace(/""/g, '"');
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }

  fields.push(current);
  return fields;
}

export function parseCsv(csvString: string, options?: CsvParseOptions): Record<string, string>[] {
  const { delimiter = ',', hasHeader = true, skipEmptyLines = true } = options ?? {};

  const lines = csvString.split(/\r?\n/);
  const filteredLines = skipEmptyLines ? lines.filter((line) => line.trim() !== '') : lines;

  if (filteredLines.length === 0) return [];

  const result: Record<string, string>[] = [];

  if (hasHeader) {
    const headers = splitCsvLine(filteredLines[0], delimiter);

    for (let i = 1; i < filteredLines.length; i++) {
      const values = splitCsvLine(filteredLines[i], delimiter);
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        const value = values[index] ?? '';
        row[parseQuotedField(header.trim())] = parseQuotedField(value);
      });

      result.push(row);
    }
  } else {
    for (let i = 0; i < filteredLines.length; i++) {
      const values = splitCsvLine(filteredLines[i], delimiter);
      const row: Record<string, string> = {};

      values.forEach((value, index) => {
        row[`col${index + 1}`] = parseQuotedField(value);
      });

      result.push(row);
    }
  }

  return result;
}

export function csvToJson(csvString: string): Record<string, string>[] {
  return parseCsv(csvString, {
    delimiter: ',',
    hasHeader: true,
    skipEmptyLines: true,
  });
}
