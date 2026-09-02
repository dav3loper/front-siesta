function apiKey(): string {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) {
        throw new Error('YOUTUBE_API_KEY es obligatorio en .env');
    }
    return key;
}

export async function findTrailerId(title: string): Promise<string | null> {
    const query = `${title} official trailer`;
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey()}&part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items?.[0]?.id?.videoId ?? null;
}
