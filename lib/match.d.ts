/**
 * If you have a `:paramName` you get an object {paramName:value}
 *
 * The last * or ** match is stored into `splat`
 **/
export interface MatchResultParams {
    splat: string;
    [paramName: string]: string;
}
export interface MatchResult {
    remainingPath: string;
    params: MatchResultParams;
}
/**
 * Attempts to match a pattern on the given pathname. Patterns may use
 * the following special characters:
 *
 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
 *                  captured string is considered a "param"
 * - ()             Wraps a segment of the URL that is optional
 * - *              Consumes (non-greedy) all characters up to the next
 *                  character in the pattern, or to the end of the URL if
 *                  there is none
 * - **             Consumes (greedy) all characters up to the next character
 *                  in the pattern, or to the end of the URL if there is none
 */
export declare function match({pattern, path}: {
    pattern: string;
    path: string;
}): MatchResult | null;
