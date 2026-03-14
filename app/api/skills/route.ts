import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Skill } from '@/models/Skill';
import { verifyToken } from '@/lib/auth';

// Get all skills or create a new skill
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const skills = await Skill.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ skills }, { status: 200 });
  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const { title, description, category } = await request.json();

    // Validation
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create skill
    const skill = await Skill.create({
      title,
      description,
      category,
      createdBy: decoded.userId,
    });

    await skill.populate('createdBy', 'name email');

    return NextResponse.json(
      {
        message: 'Skill created successfully',
        skill,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
