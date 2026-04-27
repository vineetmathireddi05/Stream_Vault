const { getUserClient } = require('../config/supabase');

exports.list = async (req, res, next) => {
  try {
    const supabase = getUserClient(req.accessToken);
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', req.user.id)
      .order('added_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ items: data });
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { tmdb_id, media_type, title, poster_path } = req.body;
    if (!tmdb_id || !media_type || !title) {
      return res.status(400).json({ error: 'tmdb_id, media_type, title required' });
    }

    const supabase = getUserClient(req.accessToken);
    const { data, error } = await supabase
      .from('watchlist')
      .upsert(
        { user_id: req.user.id, tmdb_id, media_type, title, poster_path },
        { onConflict: 'user_id,tmdb_id,media_type' }
      )
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ item: data });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const supabase = getUserClient(req.accessToken);
    const mediaType = req.query.media_type || 'movie';
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', req.user.id)
      .eq('tmdb_id', req.params.tmdb_id)
      .eq('media_type', mediaType);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
