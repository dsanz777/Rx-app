import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Add your report logic here if needed
  return NextResponse.json({ message: 'Report endpoint working' });
}