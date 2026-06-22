// Shared normalisation for room-category content coming from the admin form.
// Used by both POST (create) and PUT (update) so the two stay in lock-step.

export function slugify(input: string): string {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Accepts an array of strings, or a newline/comma-separated string, and returns
// a clean string[] with blanks removed.
function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export interface RoomContent {
  code: string;
  name: string;
  capacity: number | null;
  maxOccupancy: number;
  maxExtraBeds: number;
  basePrice: number | null;
  slug: string;
  categoryGroup: string;
  sizeLabel: string;
  bedType: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  amenities: string[];
  highlights: string[];
  images: string[];
  sortOrder: number;
  active: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseRoomBody(body: any): RoomContent {
  const code = String(body.code || '').trim().toUpperCase().replace(/\s+/g, '_');
  const name = String(body.name || '').trim();
  const capacity = parseInt(body.capacity);
  const maxOccupancy = parseInt(body.maxOccupancy);
  const maxExtraBeds = parseInt(body.maxExtraBeds);
  const basePrice =
    body.basePrice != null && body.basePrice !== '' ? parseFloat(body.basePrice) : null;
  const sortOrder = parseInt(body.sortOrder);

  // Slug: explicit value wins, otherwise derive from name; fall back to code.
  const slug = slugify(body.slug || name || code);

  return {
    code,
    name,
    capacity: isNaN(capacity) ? null : capacity,
    maxOccupancy: isNaN(maxOccupancy) ? 2 : maxOccupancy,
    maxExtraBeds: isNaN(maxExtraBeds) ? 1 : maxExtraBeds,
    basePrice: basePrice != null && !isNaN(basePrice) ? basePrice : null,
    slug,
    categoryGroup: String(body.categoryGroup || 'deluxe').trim().toLowerCase() || 'deluxe',
    sizeLabel: String(body.sizeLabel || '').trim(),
    bedType: String(body.bedType || '').trim(),
    shortDescription: String(body.shortDescription || '').trim(),
    longDescription: String(body.longDescription || '').trim(),
    features: toStringArray(body.features),
    amenities: toStringArray(body.amenities),
    highlights: toStringArray(body.highlights),
    images: toStringArray(body.images),
    sortOrder: isNaN(sortOrder) ? 100 : sortOrder,
    active: body.active === false || body.active === 'false' ? false : true,
  };
}
