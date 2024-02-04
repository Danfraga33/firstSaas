import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest, { params }: any) {
	const endPoint = params.kindeAuth;
	return handleAuth(request, endPoint);
}
