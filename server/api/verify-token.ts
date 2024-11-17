import { verifyToken } from '~/utils/tokenUtils';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body.token;

  const isValid = verifyToken(token); // Verifikasi token

  if (isValid) {
    return {
      status: 200,
      data: { valid: true },
    };
  } else {
    return {
      status: 401,
      data: { valid: false },
    };
  }
});
