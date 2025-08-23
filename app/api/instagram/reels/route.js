import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  const options = {
    method: 'GET',
    url: 'https://instagram-social-api.p.rapidapi.com/v1/reels',
    params: {
      username_or_id_or_url: username
    },
    headers: {
      'x-rapidapi-key': 'bcc8fa2726msh7c6f42a2a8a37f7p1e246djsn0fda0f064807',
      'x-rapidapi-host': 'instagram-social-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
