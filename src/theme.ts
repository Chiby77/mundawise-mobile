/**
 * MundaWise Design System
 * Central tokens — import these everywhere, never hardcode colours.
 */

export const COLORS = {
  // Brand greens
  primary:       '#1B4332',   // deep forest — headers, primary buttons
  primaryLight:  '#2D6A4F',   // mid-green — active states
  accent:        '#52B788',   // sage green — highlights, progress fills
  accentLight:   '#B7E4C7',   // pale green — badge backgrounds

  // Backgrounds
  background:    '#F1F8F3',   // off-white green tint — screen bg
  surface:       '#FFFFFF',   // cards
  surfaceAlt:    '#F8FAF8',   // inner card sections

  // Text
  text:          '#1A1A2E',   // almost-black — headings
  textSecondary: '#4B5563',   // dark grey — body
  textMuted:     '#9CA3AF',   // light grey — hints, captions

  // Semantic
  success:       '#059669',
  successLight:  '#ECFDF5',
  warning:       '#D97706',
  warningLight:  '#FFFBEB',
  danger:        '#DC2626',
  dangerLight:   '#FEF2F2',
  healthy:       '#16A34A',
  healthyLight:  '#DCFCE7',

  // Neutrals
  border:        '#E5E7EB',
  divider:       '#F3F4F6',
  overlay:       'rgba(0,0,0,0.55)',
  white:         '#FFFFFF',
  black:         '#000000',
};

export const SEVERITY_CONFIG = {
  Healthy: { bg: COLORS.healthyLight,  text: COLORS.healthy,  border: '#86EFAC', label: 'HEALTHY ✓'   },
  Low:     { bg: COLORS.warningLight,  text: '#92400E',        border: '#FCD34D', label: 'LOW RISK'    },
  Medium:  { bg: '#FFF7ED',             text: '#C2410C',        border: '#FDBA74', label: 'MEDIUM RISK' },
  High:    { bg: COLORS.dangerLight,   text: COLORS.danger,    border: '#FCA5A5', label: 'HIGH RISK ⚠' },
} as const;

export const FONTS = {
  regular:     'System',
  medium:      'System',
  bold:        'System',
  sizes: {
    xs:  11,
    sm:  13,
    md:  15,
    lg:  17,
    xl:  20,
    xxl: 24,
    h1:  30,
  },
};

export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  full: 999,
};

export const SHADOW = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
};
