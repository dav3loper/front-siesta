const yearByFestivalId: Record<string, number> = {
    "9": 2026,
};

export function yearForFestival(filmFestivalId: string): number | undefined {
    return yearByFestivalId[filmFestivalId];
}
