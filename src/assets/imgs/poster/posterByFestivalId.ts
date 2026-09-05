import defaultPoster from "./58_Sitges.png";
import sitges2024 from "./57_Sitges.jpg";
import sitges2026 from "./59_Sitges.jpg";

const postersByFestivalId: Record<string, string> = {
    "7": sitges2024,
    "9": sitges2026,
};

export function posterForFestival(id: string): string {
    return postersByFestivalId[id] ?? defaultPoster;
}
