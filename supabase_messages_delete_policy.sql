-- =============================================
-- Messages Table: DELETE Policy Update
-- =============================================
-- Allow users to delete their own messages
-- Allow admins to delete any message

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can delete any message" ON public.messages;

-- Create new delete policy for own messages
CREATE POLICY "Users can delete own messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- Create policy for admin to delete any message
CREATE POLICY "Admins can delete any message"
  ON public.messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- Verify: Check if policies were created
-- =============================================
-- Run this in SQL Editor to verify:
-- SELECT * FROM pg_policies WHERE tablename = 'messages';
