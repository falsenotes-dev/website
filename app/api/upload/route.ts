import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { Stream } from "stream";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData(); 
    const file: Stream | null = data.get('file') as unknown as Stream;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' });
    }

    const postId = req.nextUrl.searchParams.get("postId");
    const authorId = req.nextUrl.searchParams.get("authorId");

    if (!postId || !authorId) {
      return NextResponse.json({ success: false, message: 'postId and authorId are required query parameters' });
    }

    const buffer = Buffer.from(await new Promise((resolve, reject) => {
      const chunks: any[] = [];
      file.on('data', chunk => chunks.push(chunk));
      file.on('error', reject);
      file.on('end', () => resolve(Buffer.concat(chunks)));
    }));

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
    const containerClient = blobServiceClient.getContainerClient('blogs');
    const blockBlobClient = containerClient.getBlockBlobClient(`${authorId}/${postId}`);

    await blockBlobClient.upload(buffer, buffer.length);

    const url = `https://falsenotescontent.blob.core.windows.net/blogs/${authorId}/${postId}`;

    return NextResponse.json({ success: true, message: 'File uploaded', data: { url } });
  } catch (error : any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}