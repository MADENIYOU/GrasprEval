import { NextResponse } from 'next/server';
import { getResetCodeData, incrementAttempt, resetAttempts, blockUser } from '../../../../../lib/db';

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const data = await getResetCodeData(email);

  if (!data) {
    return NextResponse.json({ error: "Aucune demande de code trouvée." }, { status: 404 });
  }

  if (data.isBlocked) {
    return NextResponse.json({ error: "Compte bloqué après trop de tentatives." }, { status: 403 });
  }

  if (data.code !== code) {
    await incrementAttempt(email);
    if (data.attempts + 1 >= 10) {
      await blockUser(email);
      return NextResponse.json({ error: "Trop de tentatives. Compte bloqué." }, { status: 403 });
    }
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
  }

  if (new Date() > new Date(data.expiresAt)) {
    return NextResponse.json({ error: "Code expiré." }, { status: 400 });
  }

  await resetAttempts(email);
  return NextResponse.json({ success: true });
}
