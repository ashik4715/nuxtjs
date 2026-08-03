interface TemplateData {
  [key: string]: string | number | boolean | null | undefined;
}

function getNestedValue(
  obj: TemplateData,
  path: string
): string | number | boolean | null | undefined {
  const keys = path.split('.');
  let current: TemplateData | string | number | boolean | null | undefined = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as TemplateData)[key];
  }

  return current;
}

export function interpolateTemplate(template: string, data: TemplateData): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    const value = getNestedValue(data, trimmedKey);

    if (value === null || value === undefined) {
      return match;
    }

    return String(value);
  });
}

export function extractPlaceholders(template: string): string[] {
  const matches = template.match(/\{\{([^}]+)\}\}/g) ?? [];

  return matches.map((match) => {
    return match.slice(2, -2).trim();
  });
}
