import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token ausente' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
	
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Usuário não existe mais' });

    req.user = {
      _id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      telefone: user.telefone,
      createdAt: user.createdAt,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
}
