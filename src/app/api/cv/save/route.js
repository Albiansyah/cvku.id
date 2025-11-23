import { supabase } from '../../../../lib/supabaseClient'; // Sesuaikan path jika perlu

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { cvData, userId, userEmail } = req.body;
    
    // Validasi input dasar
    if (!cvData || !userId) {
      return res.status(400).json({ error: 'Data CV dan User ID dibutuhkan.' });
    }

    // Menggunakan 'upsert' untuk membuat data baru atau mengupdate jika sudah ada
    // Kita anggap satu user hanya punya satu CV untuk saat ini
    const { data, error } = await supabase
      .from('cvs')
      .upsert({ 
        user_id: userId, 
        user_email: userEmail,
        cv_data: cvData,
        updated_at: new Date().toISOString() 
      }, {
        onConflict: 'user_id' // Jika ada konflik di kolom user_id, update saja datanya
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    res.status(200).json({ 
      success: true, 
      message: 'CV berhasil disimpan ke Supabase!',
      cvId: data.id // Kirim kembali ID CV yang baru dibuat/diupdate
    });

  } catch (error) {
    res.status(500).json({ error: `Terjadi kesalahan di server: ${error.message}` });
  }
}
