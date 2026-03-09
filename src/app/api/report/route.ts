import { NextResponse } from 'next/server';

export async function GET() {
  // Add your report logic here if needed
  return NextResponse.json({ message: 'Report endpoint working' });
}
