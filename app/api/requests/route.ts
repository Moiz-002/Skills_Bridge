import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Request as SkillRequest } from '@/models/Request';
import { Skill } from '@/models/Skill';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

// Get requests (both sent and received)
export async function GET(request: NextRequest) {
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

    // Get the type from query params
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';

    let query = {};

    if (type === 'sent') {
      query = { studentId: decoded.userId };
    } else if (type === 'received') {
      query = { teacherId: decoded.userId };
    } else {
      query = {
        $or: [
          { studentId: decoded.userId },
          { teacherId: decoded.userId },
        ],
      };
    }

    const requests = await SkillRequest.find(query)
      .populate('skillId', 'title description')
      .populate('studentId', 'name email')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a request
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

    const { skillId } = await request.json();

    if (!skillId) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return NextResponse.json(
        { error: 'Invalid skill ID' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Check if user is the skill creator (can't request own skill)
    if (skill.createdBy.toString() === decoded.userId) {
      return NextResponse.json(
        { error: 'Cannot request your own skill' },
        { status: 400 }
      );
    }

    // Check if request already exists
    const existingRequest = await SkillRequest.findOne({
      skillId,
      studentId: decoded.userId,
      teacherId: skill.createdBy,
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Request already exists' },
        { status: 400 }
      );
    }

    // Create request
    const newRequest = await SkillRequest.create({
      skillId,
      studentId: decoded.userId,
      teacherId: skill.createdBy,
      status: 'pending',
    });

    await newRequest.populate([
      { path: 'skillId', select: 'title description' },
      { path: 'studentId', select: 'name email' },
      { path: 'teacherId', select: 'name email' },
    ]);

    return NextResponse.json(
      {
        message: 'Request sent successfully',
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update request status (accept/reject)
export async function PUT(request: NextRequest) {
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

    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400 }
      );
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Find request
    const skillRequest = await SkillRequest.findById(requestId);
    if (!skillRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Check if user is the teacher
    if (skillRequest.teacherId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update status
    skillRequest.status = status;
    await skillRequest.save();

    await skillRequest.populate([
      { path: 'skillId', select: 'title description' },
      { path: 'studentId', select: 'name email' },
      { path: 'teacherId', select: 'name email' },
    ]);

    return NextResponse.json(
      {
        message: `Request ${status} successfully`,
        request: skillRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
