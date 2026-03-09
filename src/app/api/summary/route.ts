import { NextResponse } from 'next/server';

export async function GET() {
  // Add your summary logic here if needed
  return NextResponse.json({ message: 'Summary endpoint working' });
}
