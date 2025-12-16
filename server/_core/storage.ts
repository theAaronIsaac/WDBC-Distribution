/**
 * Client-side storage helper for uploading files to S3
 */
export async function storagePut(
  key: string,
  data: Uint8Array | string,
  contentType?: string
): Promise<{ key: string; url: string }> {
  const response = await fetch('/api/storage/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      data: Array.from(data instanceof Uint8Array ? data : new TextEncoder().encode(data)),
      contentType,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}
