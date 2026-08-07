-- Migration: Enhance API Security
-- Purpose: Add additional security constraints and improve RLS policies

-- =============================================
-- SECURITY ENHANCEMENTS
-- =============================================

-- Add constraint to prevent empty strings in critical fields
ALTER TABLE requests
  ADD CONSTRAINT requests_title_not_empty CHECK (length(trim(title)) > 0),
  ADD CONSTRAINT requests_description_not_empty CHECK (length(trim(description)) > 0);

ALTER TABLE briefs
  ADD CONSTRAINT briefs_product_overview_not_empty CHECK (length(trim(product_overview)) > 0),
  ADD CONSTRAINT briefs_procurement_summary_not_empty CHECK (length(trim(procurement_summary)) > 0);

-- =============================================
-- ENHANCED RLS POLICIES FOR ANALYSES
-- =============================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can update analyses for their own requests" ON analyses;
DROP POLICY IF EXISTS "Users can delete analyses for their own requests" ON analyses;

-- Prevent users from updating or deleting analyses (immutable after creation)
CREATE POLICY "Prevent updates to analyses"
  ON analyses FOR UPDATE
  USING (false);

CREATE POLICY "Prevent deletes to analyses"
  ON analyses FOR DELETE
  USING (false);

-- =============================================
-- ENHANCED RLS POLICIES FOR BRIEFS
-- =============================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can update briefs for their own requests" ON briefs;
DROP POLICY IF EXISTS "Users can delete briefs for their own requests" ON briefs;

-- Prevent users from updating or deleting briefs (immutable after creation)
CREATE POLICY "Prevent updates to briefs"
  ON briefs FOR UPDATE
  USING (false);

CREATE POLICY "Prevent deletes to briefs"
  ON briefs FOR DELETE
  USING (false);

-- =============================================
-- AUDIT LOG TABLE (Optional but recommended)
-- =============================================

-- Create audit log table to track sensitive operations
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);

-- Enable RLS on audit_logs (only admins can view)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System can insert audit logs (no user restriction)
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- =============================================
-- FUNCTION TO LOG REQUEST CHANGES
-- =============================================

CREATE OR REPLACE FUNCTION log_request_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), 'DELETE', 'requests', OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'UPDATE', 'requests', NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'INSERT', 'requests', NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for request changes
DROP TRIGGER IF EXISTS audit_requests_changes ON requests;
CREATE TRIGGER audit_requests_changes
  AFTER INSERT OR UPDATE OR DELETE ON requests
  FOR EACH ROW
  EXECUTE FUNCTION log_request_changes();

-- =============================================
-- ADD UNIQUE CONSTRAINT
-- =============================================

-- Ensure only one analysis per request at a time
-- (Users can create new analysis, but old ones remain for history)
-- This is optional - remove if you want multiple analyses per request

-- Ensure only one brief per request
CREATE UNIQUE INDEX IF NOT EXISTS idx_briefs_request_id_unique 
  ON briefs(request_id);

-- =============================================
-- PERFORMANCE OPTIMIZATION
-- =============================================

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_requests_user_status 
  ON requests(user_id, status);

CREATE INDEX IF NOT EXISTS idx_requests_user_created 
  ON requests(user_id, created_at DESC);

-- =============================================
-- SECURITY NOTES
-- =============================================
-- This migration adds:
-- 1. Immutable policies for analyses and briefs (cannot be updated/deleted)
-- 2. Audit logging for all request operations
-- 3. Validation constraints for empty strings
-- 4. Unique constraint for briefs (one brief per request)
-- 5. Performance indexes for common queries
-- 
-- Additional security is handled at application level:
-- - All API routes verify auth.uid() matches resource owner
-- - Services use user_id in queries to ensure ownership
-- - OpenAI API key is server-side only (never exposed to client)
