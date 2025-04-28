import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    console.log('API: Attempting to connect to database');
    await connectToDatabase();
    console.log('API: Connected to database, fetching transactions');
    const transactions = await Transaction.find({}).sort({ date: -1 });
    console.log('API: Found transactions:', transactions.length);
    
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    const transaction = await Transaction.create(body);
    
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}