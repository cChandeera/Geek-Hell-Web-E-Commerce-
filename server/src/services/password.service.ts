import { generateRandomToken, hashToken } from '../utils/token.util';
import { hashPassword, comparePassword } from '../utils/password.util';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';

export class PasswordService {
  public static async hashPassword(password: string): Promise<string> {
    return hashPassword(password);
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return comparePassword(password, hash);
  }

  public static async createPasswordResetToken(email: string): Promise<{ rawToken: string; expiresAt: Date }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'No account found with that email address');
    }

    const { rawToken, hashedToken } = generateRandomToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 Minutes

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expiresAt;
    await user.save();

    return { rawToken, expiresAt };
  }

  public static async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const hashed = hashToken(rawToken);
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(400, 'Password reset token is invalid or has expired');
    }

    user.password = newPassword; // Pre-save hook will hash it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all previous active sessions
    await user.save();
  }

  public static async createEmailVerificationToken(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { rawToken, hashedToken } = generateRandomToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    return rawToken;
  }

  public static async verifyEmailToken(rawToken: string): Promise<void> {
    const hashed = hashToken(rawToken);
    const user = await User.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(400, 'Email verification token is invalid or has expired');
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
  }
}
