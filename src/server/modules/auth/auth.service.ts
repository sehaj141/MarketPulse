import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../../database/db';
import { User, UserRole } from '../../types';

const JWT_SECRET = process.env.JWT_SECRET || 'marketpulse_super_secret_jwt_key_2026_production_grade';

export class AuthService {
  public static async register(email: string, password: string, name: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const existing = db.getUserByEmail(email);
    if (existing) {
      throw new Error('User already exists with this email address.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      name,
      role: 'USER',
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPass } = newUser;

    return { token, user: userWithoutPass };
  }

  public static async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const user = db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password credentials.');
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPass } = user;

    return { token, user: userWithoutPass };
  }

  public static verifyToken(token: string): { id: string; email: string; role: UserRole } {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    } catch {
      throw new Error('Invalid or expired authentication token.');
    }
  }
}
