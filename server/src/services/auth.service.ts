import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from '../validators/auth.validator';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import { UserService } from './user.service';
import { AuthUserPayload } from '../types/express';

export class AuthService {
  public static async register(input: RegisterInput) {
    const existingUser = await UserService.findByEmail(input.email);
    if (existingUser) {
      throw new ApiError(400, 'A user account with this email address already exists');
    }

    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password, // Pre-save hook will hash with 12 salt rounds
      role: input.role || 'customer',
      avatar: input.avatar || '',
    });

    const payload: AuthUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = TokenService.generateAuthTokens(payload);
    await TokenService.saveRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: UserService.sanitizeUser(user),
      tokens,
    };
  }

  public static async login(input: LoginInput) {
    const user = await UserService.findByEmail(input.email, true);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (user.status === 'blocked') {
      throw new ApiError(403, 'Your account has been suspended. Please contact support.');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save();

    const payload: AuthUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const tokens = TokenService.generateAuthTokens(payload);
    await TokenService.saveRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user: UserService.sanitizeUser(user),
      tokens,
    };
  }

  public static async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await TokenService.removeRefreshToken(userId, refreshToken);
    } else {
      await TokenService.clearAllRefreshTokens(userId);
    }
  }

  public static async refreshToken(incomingToken: string) {
    const { user, tokens } = await TokenService.rotateRefreshToken(incomingToken);
    return {
      user: UserService.sanitizeUser(user),
      tokens,
    };
  }

  public static async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isMatch = await user.comparePassword(input.oldPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password entered is incorrect');
    }

    user.password = input.newPassword; // Pre-save hook will hash
    user.refreshTokens = []; // Invalidate all previous refresh tokens on password change
    await user.save();

    return UserService.sanitizeUser(user);
  }

  public static async forgotPassword(input: ForgotPasswordInput) {
    const { rawToken } = await PasswordService.createPasswordResetToken(input.email);
    // Ready for SMTP integration: returns reset token for test/dev verification
    return { message: 'Password reset token generated successfully', resetToken: rawToken };
  }

  public static async resetPassword(input: ResetPasswordInput) {
    await PasswordService.resetPassword(input.token, input.newPassword);
    return { message: 'Password has been reset successfully. Please login with your new password.' };
  }

  public static async verifyEmail(input: VerifyEmailInput) {
    await PasswordService.verifyEmailToken(input.token);
    return { message: 'Email verified successfully.' };
  }

  public static async getCurrentUser(userId: string) {
    const user = await UserService.findById(userId);
    return UserService.sanitizeUser(user);
  }
}

// Named function exports for backwards compatibility
export const registerUser = (input: Parameters<typeof AuthService.register>[0]) => AuthService.register(input);
export const loginUser = (input: Parameters<typeof AuthService.login>[0]) => AuthService.login(input);
export const getUserById = (userId: string) => AuthService.getCurrentUser(userId);
