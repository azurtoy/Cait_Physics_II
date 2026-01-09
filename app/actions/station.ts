'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function verifyAccessCode(code: string) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Verify access code against environment variable (using existing PHYSICS_PASSWORD)
  const correctCode = process.env.PHYSICS_PASSWORD || '1234';
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Access Code Verification:');
  console.log('   User:', user.email);
  console.log('   Input Code:', code);
  console.log('   Expected Code:', correctCode);
  console.log('   Match:', code === correctCode);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (code !== correctCode) {
    return { success: false, error: 'Invalid access code' };
  }

  // Update user profile to unlock Physics
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ is_physics_unlocked: true })
    .eq('id', user.id);

  if (updateError) {
    console.error('❌ Failed to update profile:', updateError);
    return { success: false, error: 'Failed to update profile' };
  }

  console.log('✅ Access granted: Physics unlocked for user', user.email);
  
  revalidatePath('/station');
  return { success: true };
}
