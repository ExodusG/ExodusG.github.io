import Parser from 'rss-parser';
export const parserLetterboxd=new Parser({
  customFields: {
    item: [
      'letterboxd:filmTitle',
      'letterboxd:filmYear',
      'letterboxd:memberRating',
      'letterboxd:watchedDate',
      'tmdb:movieId'
    ]
  }
});
export async function GET() {
    try {
        const feed = await parserLetterboxd.parseURL('https://letterboxd.com/exodus_/rss/');
        
        const movies = feed.items.map(item => {
            const title = item['letterboxd:filmTitle'];
            const year = item['letterboxd:filmYear'];
            
            let rating = 0;
            if (item['letterboxd:memberRating']) {
                rating = parseFloat(item['letterboxd:memberRating']);
            }
            
            const imageMatch = item.content.match(/<img.*?src="(.*?)"/);
            const image = imageMatch ? imageMatch[1] : null;
            
            const watchedDate = new Date(item['letterboxd:watchedDate'] || item.isoDate);
            const correctedDate = new Date(watchedDate.getTime() + watchedDate.getTimezoneOffset() * 60000);

            const formattedDate = correctedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });
            return {
                title,
                year,
                image,
                rating,
                watchedDate: formattedDate,
                link: item.link
            };
        });

        return new Response(JSON.stringify(movies), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
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