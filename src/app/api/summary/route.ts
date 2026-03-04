import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Add your summary logic here if needed
  return NextResponse.json({ message: 'Summary endpoint working' });
}