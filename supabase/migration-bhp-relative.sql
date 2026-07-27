-- ============================================================
-- Thêm cột bhp_relative cho CRM Học sinh
-- bhp_relative: người thân BHP bên Hàn (Bố, Mẹ, Anh, Chị)
-- ============================================================

ALTER TABLE crm_students ADD COLUMN IF NOT EXISTS bhp_relative TEXT DEFAULT '';
