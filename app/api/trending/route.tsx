import { NextResponse } from 'next/server';


const MOCK_TRENDS = [
    {
        name: "World Cup 2026",
        url: "https://twitter.com",
        tweet_volume: 15200
    },
    {
        name: "Donald Trump",
        url: "https://twitter.com",
        tweet_volume: 8500
    },
    {
        name: "#Shelby",
        url: "https://twitter.com",
        tweet_volume: 15200
    },
    {
        name: "OpenAI",
        url: "https://twitter.com",
        tweet_volume: 125000
    },
    {
        name: "RapidAPI",
        url: "https://twitter.com",
        tweet_volume: null
    }
];

export async function GET() {
    if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(MOCK_TRENDS);
    }

    // Production logic
    const url = 'https://twitter241.p.rapidapi.com/trends-by-location?woeid=23424977';

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
                'x-rapidapi-host': 'twitter241.p.rapidapi.com'
            },
            // Cache for 3 hours to optimize API quota
            next: { revalidate: 10800 }
        });

        // Handle Rate Limiting (Error 429)
        if (res.status === 429) {
            return NextResponse.json(
                { error: 'QUOTA_EXCEEDED', message: 'API rate limit reached' },
                { status: 429 }
            );
        }

        if (!res.ok) {
            return NextResponse.json(
                { error: 'FETCH_ERROR', message: 'Failed to fetch data' },
                { status: res.status }
            );
        }

        const data = await res.json();
        // Extract trending data based on API response structure
        const trendingData =
            data.result?.[0]?.trends ||
            data.result?.trends ||
            data.trends ||
            (Array.isArray(data.result) ? data.result : []);

        return NextResponse.json(trendingData);
    } catch (error) {
        return NextResponse.json(
            { error: 'SERVER_ERROR', message: 'Internal server error' },
            { status: 500 }
        );
    }
}