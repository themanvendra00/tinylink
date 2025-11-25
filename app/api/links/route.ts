import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isValidUrl, isValidCode, generateCode } from '@/lib/validation';

export async function GET() {
  try {
    const links = await db.link.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl, code: customCode } = body;

    // Validate URL
    if (!originalUrl || typeof originalUrl !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Handle custom code or generate one
    let code: string;
    if (customCode) {
      if (typeof customCode !== 'string') {
        return NextResponse.json(
          { error: 'Code must be a string' },
          { status: 400 }
        );
      }

      if (!isValidCode(customCode)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      // Check if code already exists
      const existingLink = await db.link.findUnique({
        where: { code: customCode },
      });

      if (existingLink) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }

      code = customCode;
    } else {
      // Generate unique code
      let attempts = 0;
      do {
        code = generateCode();
        const existing = await db.link.findUnique({
          where: { code },
        });
        if (!existing) break;
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { error: 'Failed to generate unique code' },
            { status: 500 }
          );
        }
      } while (true);
    }

    // Create link
    const link = await db.link.create({
      data: {
        code,
        originalUrl,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

