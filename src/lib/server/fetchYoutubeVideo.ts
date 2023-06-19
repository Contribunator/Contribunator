import { e2e, youtubeApi } from "@/lib/env";

type YoutubeVideo = {
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
};

export default async function fetchYoutubeVideo(
  id: string
): Promise<YoutubeVideo> {
  if (e2e) {
    return {
      title: "My Video Title",
      description: "My Video Description",
      channelId: "CHANNEL_ID",
      channelTitle: "My Channel Title",
      publishedAt: "2021-01-01T00:00:00Z",
    };
  }
  if (!youtubeApi) {
    throw new Error("YOUTUBE_API_KEY not set");
  }
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.items[0].snippet;
}
