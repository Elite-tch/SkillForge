import { NextRequest, NextResponse } from 'next/server';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  console.warn('Pinata API keys not configured. IPFS uploads will fail.');
}

export async function POST(req: NextRequest) {
  try {
    const skillData = await req.json();

    // Validate required fields
    const { name, description, category, tags } = skillData;
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // Create metadata JSON
    const metadata = {
      name,
      description,
      category: category || 'General',
      tags: tags || [],
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    };

    // Pin to IPFS via Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY!,
        'pinata_secret_api_key': PINATA_SECRET_KEY!,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${name} - Skill Metadata`,
        },
      }),
    });
    console.log("pinataResponse", pinataResponse);

    if (!pinataResponse.ok) {
      const errorData = await pinataResponse.text();
      console.error('Pinata error:', errorData);
      return NextResponse.json(
        { error: 'Failed to upload to IPFS', details: errorData },
        { status: 500 }
      );
    }

    const pinataData = await pinataResponse.json();
    const ipfsHash = pinataData.IpfsHash;
    const ipfsUrl = `ipfs://${ipfsHash}`;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return NextResponse.json({
      success: true,
      ipfsHash,
      ipfsUrl,
      gatewayUrl,
      metadata,
    });

  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
