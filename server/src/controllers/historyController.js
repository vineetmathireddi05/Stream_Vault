const { getUserClient } = require('../config/supabase');

exports.list = async (req, res, next) => {
  try {
    const supabase = getUserClient(req.accessToken);
    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('watched_at', { ascending: false })
      .limit(40);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ items: data });
  } catch (err) {
    next(err);
  }
};

exports.upsert = async (req, res, next) => {
  try {
    const { tmdb_id, media_type, title, poster_path, progress_seconds, duration_seconds } = req.body;
    if (!tmdb_id || !media_type) {
      return res.status(400).json({ error: 'tmdb_id and media_type required' });
    }

    const supabase = getUserClient(req.accessToken);

    const { data: existing } = await supabase
      .from('watch_history')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('tmdb_id', tmdb_id)
      .eq('media_type', media_type)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('watch_history')
        .update({
          progress_seconds: progress_seconds || 0,
          duration_seconds: duration_seconds || null,
          watched_at: new Date().toISOString(),
          title,
          poster_path,
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) return res.status(400).json({ error: error.message });
      return res.json({ item: data });
    }

    const { data, error } = await supabase
      .from('watch_history')
      .insert({
        user_id: req.user.id,
        tmdb_id,
        media_type,
        title,
        poster_path,
        progress_seconds: progress_seconds || 0,
        duration_seconds: duration_seconds || null,
      })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ item: data });
  } catch (err) {
    next(err);
  }
};
