export function findString(text: string, startString: string, endString: string) {
    const start = text.indexOf(startString);

    const sub1 = text.substring(start + startString.length);
    const end = sub1.indexOf(endString);
    return sub1.substring(0, end).trim();
}