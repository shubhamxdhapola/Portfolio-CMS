const isProduction = process.env.NODE_ENV === 'production';

export const saveCookie = (token, _, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };

  res.cookie('access_token', token, cookieOptions);
};

export const clearCookie = (_, res) => {

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: isProduction ? 'none' : 'lax',
  };
  res.clearCookie('access_token', cookieOptions);
};

export default saveCookie;