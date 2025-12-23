import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const video = searchParams.get('video');

    if (!video) {
        return NextResponse.json({ error: 'Missing video query' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://unofficial-youtube-api.vercel.app/youtube/search?video=${encodeURIComponent(video + ' karaoke')}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
    }
}
