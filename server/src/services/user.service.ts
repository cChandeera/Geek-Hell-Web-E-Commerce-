import { User, IUser } from '../models/User';
import { ApiError } from '../utils/ApiError';

export class UserService {
  public static async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password +refreshTokens');
    }
    return query.exec();
  }

  public static async findById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  public static sanitizeUser(user: IUser) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone || '',
      isVerified: user.isVerified,
      status: user.status,
      wishlist: user.wishlist,
      cart: user.cart,
      addresses: user.addresses,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
