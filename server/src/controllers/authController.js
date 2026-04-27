const { supabaseAdmin } = require('../config/supabase');

exports.signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username: username || email.split('@')[0] },
    });
    if (error) return res.status(400).json({ error: error.message });

    const { data: signIn, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) return res.status(400).json({ error: signInError.message });

    res.json({ user: data.user, session: signIn.session });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.accessToken;
    if (token) await supabaseAdmin.auth.admin.signOut(token).catch(() => {});
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
