export const APP_CONSTANTS = {
  APP_NAME: 'Geek Hell',
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  FRANCHISES: ['Marvel', 'DC', 'GeekOriginal', 'Anime'] as const,
  SIZES: ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const,
  PRINT_SIDES: ['front', 'back', 'left_sleeve', 'right_sleeve'] as const,
};
