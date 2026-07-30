/**
 * /src/parsers
 * HTML email parsers (LinkedIn job alerts) and API payload normalizers.
 */
export interface JobParser<TInput, TOutput> {
  parse(rawPayload: TInput): TOutput[];
}
