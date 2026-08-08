import { generateJobPoster } from '../utils/generateJobPoster';
import { generateSeoCaption } from '../utils/generateSeoCaption';

/**
 * Fallback poster URL generator
 */
export async function uploadPosterToStorage(blob, filename) {
  return null;
}

/**
 * Publish job post to Instagram via Meta Graph API or Webhook
 */
export async function publishToInstagram(job) {
  // 1. Generate 1080x1080 Poster Graphic
  const { dataUrl, blob } = await generateJobPoster(job);

  // 2. Generate SEO-optimized caption & alt text
  const seoData = generateSeoCaption(job);

  // 3. Upload image to Storage for public URL
  const filename = `job-${Date.now()}-${(job.company || 'job').toLowerCase().replace(/[^a-z0-9]/g, '')}.png`;
  const publicImageUrl = await uploadPosterToStorage(blob, filename);

  const igAccountId = import.meta.env.VITE_INSTAGRAM_ACCOUNT_ID;
  const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
  const webhookUrl = import.meta.env.VITE_INSTAGRAM_WEBHOOK_URL;

  let published = false;
  let publishMessage = '';

  // 4A. Method A: Meta Graph API (Official Instagram API)
  if (igAccountId && accessToken && publicImageUrl) {
    try {
      // Step 1: Create Container
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${igAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: publicImageUrl,
            caption: seoData.caption,
            access_token: accessToken,
          }),
        }
      );

      const containerData = await containerRes.json();
      if (!containerRes.ok || !containerData.id) {
        throw new Error(containerData.error?.message || 'Failed to create Instagram media container');
      }

      // Step 2: Publish Container
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: accessToken,
          }),
        }
      );

      const publishData = await publishRes.json();
      if (!publishRes.ok || !publishData.id) {
        throw new Error(publishData.error?.message || 'Failed to publish container to Instagram');
      }

      published = true;
      publishMessage = '✅ Successfully posted live to Instagram!';
    } catch (err) {
      publishMessage = `⚠️ Instagram API Error: ${err.message}`;
    }
  }

  // 4B. Method B: Webhook (Zapier / Make.com)
  else if (webhookUrl && publicImageUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: publicImageUrl,
          caption: seoData.caption,
          altText: seoData.altText,
          job,
        }),
      });

      if (res.ok) {
        published = true;
        publishMessage = '✅ Successfully sent to Instagram Automation Webhook!';
      } else {
        publishMessage = `⚠️ Webhook failed with status ${res.status}`;
      }
    } catch (err) {
      publishMessage = `⚠️ Webhook Error: ${err.message}`;
    }
  }

  // 4C. Fallback / Manual Download Mode
  else {
    publishMessage = publicImageUrl
      ? '📸 Poster uploaded to Supabase Storage! (Configure Instagram Access Token in .env to enable direct auto-posting)'
      : '📸 Poster graphic & SEO caption created!';
  }

  return {
    published,
    message: publishMessage,
    dataUrl,
    publicImageUrl,
    caption: seoData.caption,
    altText: seoData.altText,
    hashtags: seoData.hashtags,
  };
}
