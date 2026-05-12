export const COLOR_PALETTE = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#A78BFA', '#EC4899', '#FB7185', '#FCD34D', '#34D399']

export const light = {
  colors: {
    primary: '#6366F1',
    background: '#FAFAFB',
    surface: '#FFFFFF',
    border: '#E5E7EB',

    text: '#0F172A',
    muted: '#64748B',

    palette: COLOR_PALETTE,

    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',

    accent: '#8B5CF6', 
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  typography: {
    fontFamily: 'Inter',
    sizes: { xs: 12, sm: 14, md: 16, lg: 20, xl: 28 },
    weights: { regular: '400', medium: '500', bold: '700' },
  },
}

export const dark = {
  colors: {
    primary: '#818CF8',
    background: '#0D1117',
    surface: '#161B22',
    border: 'rgba(35, 35, 35, 0.8)',

    text: '#E6EDF3',
    muted: '#8B949E',

    palette: COLOR_PALETTE,

    success: '#3FB950',
    warning: '#D29922',
    danger: '#F85149',

    accent: '#A78BFA',
  },

  spacing: light.spacing,
  typography: light.typography,
}

export type AppTheme = typeof light

export default light