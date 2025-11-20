/*
 * Temporary string->float hash function to generate random county data
*/
function stringToHash(s: string): number {
    let hash = 0;

    for (let i = 0; i < s.length; ++i) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
        hash = hash & hash;
    }

    return Math.abs(hash) / 2147483647;
}

export { stringToHash };
