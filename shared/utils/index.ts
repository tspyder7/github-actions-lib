export const parseJson = (jsonStr: string) => {
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('JSONParseError: ', (e as Error).message);
        return null;
    }
};
