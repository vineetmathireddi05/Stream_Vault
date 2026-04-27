const { getUserClient } = require('../config/supabase');

exports.getMe = async (req, res, next) => {
  try {
    const supabase = getUserClient(req.accessToken);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();
    if (error) return res.status(400).json({ error: error.message });

    if (!data) {
      const seed = {
        id: req.user.id,
        username: req.user.user_metadata?.username || req.user.email?.split('@')[0] || 'viewer',
        plan: 'free',
      };
      const { data: created, error: insertErr } = await supabase
        .from('profiles')
        .insert(seed)
        .select()
        .single();
      if (insertErr) return res.status(400).json({ error: insertErr.message });
      return res.json({ profile: created });
    }

    res.json({ profile: data });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const supabase = getUserClient(req.accessToken);
    const { username, avatar_url, plan } = req.body;

    const payload = { id: req.user.id };
    if (username !== undefined) payload.username = username;
    if (avatar_url !== undefined) payload.avatar_url = avatar_url;
    if (plan !== undefined) payload.plan = plan;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ profile: data });
  } catch (err) {
    next(err);
  }
};
