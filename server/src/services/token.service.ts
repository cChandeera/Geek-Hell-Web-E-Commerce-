import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, hashToken } from '../utils/token.util';
import { AuthUserPayload } from '../types/express';
import { ApiError } from '../utils/ApiError';

export class TokenService {
  public static generateAuthTokens(payload: AuthUserPayload) {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  public static async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashed = hashToken(refreshToken);
    await User.findByIdAndUpdate(userId, {
      $push: { refreshTokens: hashed },
    });
  }

  public static async removeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashed = hashToken(refreshToken);
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: hashed },
    });
  }

  public static async rotateRefreshToken(incomingToken: string) {
    const decoded = verifyRefreshToken(incomingToken);
    const hashedIncoming = hashToken(incomingToken);

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.refreshTokens) {
      throw new ApiError(401, 'Invalid or revoked refresh token');
    }

    const tokenIndex = user.refreshTokens.indexOf(hashedIncoming);
    if (tokenIndex === -1) {
      // Reuse detection: clear all refresh tokens for security
      user.refreshTokens = [];
      await user.save();
      throw new ApiError(401, 'Refresh token reuse detected. All sessions invalidated.');
    }

    // Remove old refresh token & generate new pair
    user.refreshTokens.splice(tokenIndex, 1);

    const payload: AuthUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = this.generateAuthTokens(payload);
    const hashedNewRefresh = hashToken(tokens.refreshToken);
    user.refreshTokens.push(hashedNewRefresh);
    await user.save();

    return { user, tokens };
  }

  public static async clearAllRefreshTokens(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }
}
