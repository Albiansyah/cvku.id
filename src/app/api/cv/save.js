import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient'; // Path disesuaikan untuk App Router

export async function POST(request) {
  // 1. Dapatkan token dari header untuk verifikasi user
  const token = request.headers.get('authorization')?.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Authentication token not provided.' }, { status: 401 });
  }

  try {
    // 2. Verifikasi token dan dapatkan data user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    // 3. Dapatkan data profil user dari tabel 'profiles' kita untuk cek plan
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('active_plan')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    // --- 4. IMPLEMENTASI LOGIKA BISNIS (Gratis vs Premium) ---
    const isPremiumUser = profile.active_plan && profile.active_plan.startsWith('premium');
    
    // Jika user adalah 'free'
    if (!isPremiumUser) {
      const { count, error: countError } = await supabase
        .from('cvs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) throw countError;

      // Jika user gratis sudah punya 1 CV, tolak permintaan
      if (count >= 1) {
        return NextResponse.json({ error: 'Batas 1 CV untuk akun gratis. Silakan upgrade ke Premium.' }, { status: 403 });
      }
    }

    // 5. Siapkan data untuk disimpan dari body request
    const { cvData, title } = await request.json(); 
    const has_watermark = !isPremiumUser; // Watermark jika bukan user premium

    // 6. Simpan data CV ke tabel 'cvs'
    const { data: newCv, error: insertError } = await supabase
      .from('cvs')
      .insert({
        user_id: user.id,
        cv_data: cvData,
        title: title || 'My CV', // Gunakan judul dari request atau default
        has_watermark: has_watermark,
      })
      .select('id') // Hanya ambil 'id' dari data yang baru dibuat
      .single();

    if (insertError) throw insertError;

    // 7. (Opsional tapi direkomendasikan) Catat aktivitas user
    await supabase.from('user_activities').insert({
      user_id: user.id,
      activity: 'cv_created',
      details: { cvId: newCv.id, title: title || 'My CV' }
    });

    // 8. Kirim respons sukses
    return NextResponse.json({ 
      success: true, 
      message: 'CV berhasil disimpan!',
      cvId: newCv.id 
    }, { status: 200 });

  } catch (error) {
    console.error('Save CV API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan di server.' }, { status: 500 });
  }
}
