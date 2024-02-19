USAGE:
usage:

```js
import scrapetube from 'scrapetube';

export const searchYoutubeVideos = async (q: string, limit = 1) => {
  const vids = scrapetube.search(q, 'video', { limit });
  const videos = [];
  const x = -1;
  for await (const info of vids) {
    const video = {
      videoId: info.videoId,
      title: info.title?.runs?.at(x + 1)?.text,
      views: info.viewCountText.simpleText,
      publishedTime: info.publishedTimeText?.simpleText,
    };
    videos.push(video);
  }
  return videos;
};
```
