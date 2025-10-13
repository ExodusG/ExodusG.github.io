import Parser from 'rss-parser';

export const parserLastfm=new Parser({
  customFields: {
    item: [
      'lfm:artist',
      'lfm:artist_url',
    ]
  }
});

export async function GET() {
    try {
        const LASTFM_API_KEY=import.meta.env.LASTFM_API_KEY;
        const username="exodus56_";
        console.log(LASTFM_API_KEY)
            const topAlbum= await Promise.all([
      fetch(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${LASTFM_API_KEY}&format=json&period=6month&limit=30`)
    ]);

        const topAlbumData=await topAlbum[0].json();

        return Response.json({
            topalbum:{
                album:topAlbumData.topalbums.album.map(album=>(
                    {
                        name:album.name,
                        image:album.image[2],
                        artist:album.artist.name
                    }
                ))
            }
        })
    } catch (error) {
        console.error('Error fetching Letterboxd data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch Letterboxd data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}