export const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const glassHoverVariant = {
  hover: { scale: 1.02, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' },
};
