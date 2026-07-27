// api/news.js — API cho Tin tức & Thành tích
// GET /api/news — Lấy danh sách bài viết (public)
// GET /api/news?id=xxx — Lấy chi tiết bài viết (public)
// POST /api/news — Tạo bài viết mới (admin)
// PUT /api/news?id=xxx — Cập nhật bài viết (admin)
// DELETE /api/news?id=xxx — Xoá bài viết (admin)

const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { method, query, body } = req;

    // ─── Kiểm tra admin auth ───
    let isAdmin = false;
    try {
      isAdmin = await checkAdminAuth(req);
    } catch(e) { /* ignore */ }

    switch (method) {
      // ─── GET: Public — lấy danh sách hoặc chi tiết ───
      case 'GET': {
        if (query.id) {
          // Chi tiết 1 bài — admin xem được cả unpublished
          let detailQuery = supabase.from('news_posts').select('*').eq('id', query.id);
          if (!isAdmin) detailQuery = detailQuery.eq('is_published', true);
          const { data, error } = await detailQuery.single();
          if (error) return res.status(404).json({ success: false, error: 'Không tìm thấy bài viết' });
          return res.status(200).json({ success: true, data });
        }
        
        // Danh sách
        let dbQuery = supabase.from('news_posts').select('*');
        
        // Nếu không phải admin, chỉ lấy bài đã publish
        if (!isAdmin) {
          dbQuery = dbQuery.eq('is_published', true);
        }
        
        // Filter theo category
        if (query.category) {
          dbQuery = dbQuery.eq('category', query.category);
        }
        
        // Sort
        dbQuery = dbQuery.order('created_at', { ascending: false });
        
        // Limit
        if (query.limit) {
          dbQuery = dbQuery.limit(parseInt(query.limit) || 50);
        }
        
        const { data, error } = await dbQuery;
        if (error) throw error;
        
        return res.status(200).json({ success: true, data: data || [] });
      }

      // ─── POST: Admin — upload ảnh hoặc tạo bài mới ───
      case 'POST': {
        if (!isAdmin) return res.status(401).json({ success: false, error: 'Unauthorized' });
        
        // Nếu là upload ảnh (action=upload-image)
        if (query.action === 'upload-image') {
          const file = body?.file;
          const fileName = body?.fileName;
          if (!file || !fileName) {
            return res.status(400).json({ success: false, error: 'Thiếu file hoặc tên file' });
          }
          
          // Decode base64
          const buffer = Buffer.from(file, 'base64');
          const timestamp = Date.now();
          const safeName = timestamp + '-' + fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
          const filePath = 'news/' + safeName;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('news-images')
            .upload(filePath, buffer, {
              contentType: body.contentType || 'image/jpeg',
              upsert: false,
            });
          
          if (uploadError) {
            // Thử tạo bucket nếu chưa có
            if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
              const { error: createError } = await supabase.storage.createBucket('news-images', {
                public: true,
                file_size_limit: 20971520,
                allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
              });
              if (createError) {
                return res.status(500).json({ success: false, error: 'Không thể tạo bucket: ' + createError.message });
              }
              // Retry upload
              const { data: retryData, error: retryError } = await supabase.storage
                .from('news-images')
                .upload(filePath, buffer, { contentType: body.contentType || 'image/jpeg' });
              if (retryError) return res.status(500).json({ success: false, error: retryError.message });
              const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(filePath);
              return res.status(200).json({ success: true, url: publicUrl });
            }
            return res.status(500).json({ success: false, error: uploadError.message });
          }
          
          const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(filePath);
          return res.status(200).json({ success: true, url: publicUrl });
        }
        
        // Fallback: tạo bài viết mới
        const { title, content, category, image_urls, is_published } = body || {};
        if (!title) return res.status(400).json({ success: false, error: 'Thiếu tiêu đề' });
        
        const { data, error } = await supabase
          .from('news_posts')
          .insert({
            title,
            content: content || '',
            category: category || 'news',
            image_urls: image_urls || [],
            is_published: is_published !== undefined ? is_published : true,
          })
          .select()
          .single();
        
        if (error) throw error;
        return res.status(201).json({ success: true, data });
      }

      // ─── PUT: Admin — cập nhật bài ───
      case 'PUT': {
        if (!isAdmin) return res.status(401).json({ success: false, error: 'Unauthorized' });
        
        const { id } = query;
        if (!id) return res.status(400).json({ success: false, error: 'Thiếu ID' });
        
        const updates = {};
        if (body.title !== undefined) updates.title = body.title;
        if (body.content !== undefined) updates.content = body.content;
        if (body.category !== undefined) updates.category = body.category;
        if (body.image_urls !== undefined) updates.image_urls = body.image_urls;
        if (body.is_published !== undefined) updates.is_published = body.is_published;
        updates.updated_at = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('news_posts')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }

      // ─── DELETE: Admin — xoá bài ───
      case 'DELETE': {
        if (!isAdmin) return res.status(401).json({ success: false, error: 'Unauthorized' });
        
        const { id } = query;
        if (!id) return res.status(400).json({ success: false, error: 'Thiếu ID' });
        
        const { error } = await supabase
          .from('news_posts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('News API error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

async function checkAdminAuth(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  
  // Cách 1: ADMIN_API_KEY (dùng cho script/cron)
  if (token === process.env.ADMIN_API_KEY) return true;
  
  // Cách 2: Supabase Auth JWT (dùng cho admin panel)
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (user && !error) return true;
  } catch(e) { /* not a valid JWT */ }
  
  return false;
}
