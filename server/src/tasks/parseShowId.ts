export type ParsedShowId =
  | { ok: true; value: number }
  | { ok: false; error: string }

/** Validates the `:id` of `/favorites/:id`: a positive integer. */
export function parseShowId(value: string): ParsedShowId {
  const id = Number(value)
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1) {
    return { ok: false, error: 'Show id must be a positive integer.' }
  }
  return { ok: true, value: id }
}
