import defaultPoster from "./58_Sitges.png";
import sitges2026 from "./59_Sitges.jpg";

const postersByFestivalId: Record<string, string> = {
    "9": sitges2026,
};

export function posterForFestival(id: string): string {
    return postersByFestivalId[id] ?? defaultPoster;
}
