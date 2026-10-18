export const saveCookie = (token, req, res) => {
  const host = req?.headers?.host || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const cookieOptions = {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: isLocalhost ? 'lax' : 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('token', token, cookieOptions);
  res.cookie('admin_token', token, cookieOptions);
};

export const clearCookie = (req, res) => {
  const host = req?.headers?.host || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const cookieOptions = {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: isLocalhost ? 'lax' : 'none',
  };

  res.clearCookie('token', cookieOptions);
  res.clearCookie('admin_token', cookieOptions);
};

export default saveCookie;