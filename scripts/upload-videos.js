const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Đọc file .env
const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
    }
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(filePath, bucketName, fileName) {
    console.log(`Đang đọc file ${fileName}... (${filePath})`);
    const fileContent = fs.readFileSync(filePath);
    
    // Kiểm tra xem bucket đã tồn tại chưa
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets && buckets.find(b => b.name === bucketName);
    
    if (!bucketExists) {
        console.log(`Tạo bucket '${bucketName}'...`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, { public: true });
        if (createError) console.error("Lỗi tạo bucket:", createError);
    } else {
        // Cập nhật bucket thành public nếu nó chưa phải
        await supabase.storage.updateBucket(bucketName, { public: true });
    }

    console.log(`Đang upload ${fileName} lên Supabase (có thể mất vài phút vì file lớn)...`);
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileContent, {
            contentType: 'video/mp4',
            upsert: true
        });

    if (error) {
        console.error(`Lỗi khi upload ${fileName}:`, error.message);
        return null;
    } else {
        console.log(`Upload thành công ${fileName}!`);
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        console.log(`Link Public: ${publicUrlData.publicUrl}`);
        return publicUrlData.publicUrl;
    }
}

async function main() {
    const dir = 'C:\\Users\\phant\\Desktop\\Thư mục mới\\Thư mục mới';
    const files = [
        'Hướng dẫn visa D2-6.mp4',
        'giải mã visa D26.mp4'
    ];

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.existsSync(filePath)) {
            await uploadFile(filePath, 'videos', file);
        } else {
            console.error(`Không tìm thấy file: ${filePath}`);
        }
    }
}

main();
