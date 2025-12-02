import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as apiResponse from '../utils/apiResponse.js';

function signToken(user) {
  const payload = { sub: user._id, role: user.role, email: user.email, nome: user.nome };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return apiResponse.badRequest(res, 'Informe email e password');

  const user = await User.findOne({ email }).select('+password');
  if (!user) return apiResponse.badRequest(res, 'Credenciais inválidas');

  const ok = await user.comparePassword(password);
  if (!ok) return apiResponse.badRequest(res, 'Credenciais inválidas');

  const token = signToken(user);
  const { password: _, ...safe } = user.toObject();
  return apiResponse.ok(res, { token, user: safe });
});

export const me = asyncHandler(async (req, res) => {
  return apiResponse.ok(res, req.user);
});
