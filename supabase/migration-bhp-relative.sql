-- ============================================================
-- Thêm cột bhp_relative và bhp_note_ext cho CRM Học sinh
-- bhp_relative: người thân BHP bên Hàn (Bố, Mẹ, Anh trai,...)
-- bhp_note_ext: ghi chú BHP (SĐT, địa chỉ người thân bên Hàn)
-- ============================================================

ALTER TABLE crm_students ADD COLUMN IF NOT EXISTS bhp_relative TEXT DEFAULT '';
ALTER TABLE crm_students ADD COLUMN IF NOT EXISTS bhp_note_ext TEXT DEFAULT '';
