/**
 * Replaces placeholders in textMsg string with actual values.
 */
export const replaceFieldText = (textMsg, replaceWith) => {
  if (Object.keys(replaceWith).length > 0) {
    for (const field in replaceWith) {
      if (Object.hasOwn(replaceWith, field)) {
        const regex = new RegExp(String.raw`\{${field}\}`, "g");
        textMsg = textMsg.replace(regex, replaceWith[field]);
      }
    }
  }
  return textMsg;
};
/**
 * Converts all string values of an object to lowercase.
 *
 * @param {T} enumObject - Object containing string values.
 * @returns {T} A new object with lowercase values.
 */
export const toLowerCaseEnum = (enumObject) => {
  return Object.fromEntries(
    Object.entries(enumObject).map(([key, value]) => [
      key,
      value.toLowerCase(),
    ]),
  );
};
export const normalizeSearchFields = (search) => {
  if (Array.isArray(search) && search.length === 0) return "";
  return search || "";
};
/**
 * Builds a Prisma `where` condition from dynamic search-field configuration.
 *
 * Each request key may map to one condition or an array of conditions. Multiple
 * conditions for one request key are combined with OR; different request keys
 * are combined with AND.
 *
 * @returns A Prisma-compatible where object, or null for invalid input.
 */
export const getSearchFilterPrismaCondition = (searchFields, requestFields) => {
  const andConditions = [];
  for (const [key, config] of Object.entries(searchFields)) {
    const value = requestFields[key];
    if (value === undefined || value === "") continue;
    const configs = Array.isArray(config) ? config : [config];
    const conditions = configs
      .map((currentConfig) => buildPrismaSearchCondition(currentConfig, value))
      .filter((condition) => condition !== null);
    if (conditions.length !== configs.length) return {};
    if (conditions.length === 1) andConditions.push(conditions[0]);
    else if (conditions.length > 1) andConditions.push({ OR: conditions });
  }
  return { AND: andConditions };
};
const buildPrismaSearchCondition = (config, value) => {
  switch (config.type.trim()) {
    case "regex":
      return buildPrismaRegexCondition(config, value);
    case "equal":
      return buildPrismaEqualCondition(config, value);
    case "objectField":
      return { [config.field]: { path: [String(value)], equals: 1 } };
    case "range":
      return buildPrismaRangeCondition(config.field, value);
    case "date":
      return buildPrismaDateCondition(config, value);
    case "notNullBoolean": {
      const normalized = String(value).toLowerCase();
      if (normalized === "true") return { [config.field]: { not: null } };
      if (normalized === "false") return { [config.field]: null };
      return null;
    }
    default:
      return null;
  }
};
const buildPrismaRegexCondition = (config, value) => {
  const values = config.allowMulti && Array.isArray(value) ? value : [value];
  const conditions = values.map((item) => ({
    [config.field]: { contains: String(item).trim(), mode: "insensitive" },
  }));
  return conditions.length === 1 ? conditions[0] : { OR: conditions };
};
const buildPrismaEqualCondition = (config, value) => {
  const values = config.allowMulti && Array.isArray(value) ? value : [value];
  if (config.dataType === "Number") {
    const numbers = values.map(Number);
    if (numbers.some(Number.isNaN)) return null;
    return config.allowMulti && Array.isArray(value)
      ? { [config.field]: { in: numbers } }
      : { [config.field]: numbers[0] };
  }
  if (config.dataType === "Boolean") {
    const booleans = values.map((item) => String(item).toLowerCase());
    if (booleans.some((item) => item !== "true" && item !== "false"))
      return null;
    const parsed = booleans.map((item) => item === "true");
    return config.allowMulti && Array.isArray(value)
      ? { [config.field]: { in: parsed } }
      : { [config.field]: parsed[0] };
  }
  if (config.dataType === "String") {
    if (values.some((item) => typeof item !== "string")) return null;
    return config.allowMulti && Array.isArray(value)
      ? { [config.field]: { in: values } }
      : { [config.field]: values[0] };
  }
  return null;
};
const buildPrismaRangeCondition = (field, value) => {
  if (typeof value !== "string") return null;
  const [minimum, maximum] = value.split(" - ").map(Number);
  if (Number.isNaN(minimum) || Number.isNaN(maximum)) return null;
  return { [field]: { gte: minimum, lte: maximum } };
};
const buildPrismaDateCondition = (config, value) => {
  if (typeof value !== "string") return null;
  const values = value.split(" - ").map((item) => parseSearchDate(item));
  if (values.some((item) => item === null)) return null;
  if (config.dataType === "range" && values.length === 2) {
    const start = new Date(values[0]);
    const end = new Date(values[1]);
    end.setHours(23, 59, 59, 999);
    return { [config.field]: { gte: start, lte: end } };
  }
  return { [config.field]: new Date(values[0]) };
};
const parseSearchDate = (value) => {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
