/**
 * Firebase Auth middleware — verifies Firebase ID token on every protected request.
 * Extracts the decoded token and attaches it to req.user.
 */
const { getAuth } = require('firebase-admin/auth');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const token = header.split('Bearer ')[1];
    const decoded = await getAuth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Token verification failed:', err.message);
    }
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};
