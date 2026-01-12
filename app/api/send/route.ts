import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 이메일과 메시지 추출
    const body = await request.json();
    const email = body.email || 'Unknown';
    const message = body.message || 'No message provided';
    
    // 썬더베이 현지 시각 (Eastern Time)
    const thunderBayTime = new Date().toLocaleString('en-CA', { 
      timeZone: 'America/Toronto', 
      hour12: true 
    });
    
    // 이메일 발송
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'azurtoy@gmail.com',
      subject: '[Void Space Plan] Signal Received from Thunder Bay Station',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h3 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 18px; margin: 0 0 15px 0;">Signal Report</h3>
          <p style="font-size: 14px;"><strong>From:</strong> ${email}</p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #3498db; margin: 15px 0;">
            <p style="margin: 0; font-weight: bold; font-size: 13px; color: #555;">MESSAGE CONTENT:</p>
            <p style="margin: 10px 0 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #888;">
            Sent from Thunder Bay Station | Local Time: ${thunderBayTime}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully:', data?.id);
    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Exception sending email:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
