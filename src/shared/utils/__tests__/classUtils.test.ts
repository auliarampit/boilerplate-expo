import {
  combineClasses,
  createThemeClasses,
  createStateClasses,
  createResponsiveClasses,
  createButtonClasses,
  createInputClasses
} from '../classUtils';

// Mock the themeClasses module
jest.mock('../constants/themeClasses', () => ({
  getThemeClass: jest.fn((isDark: boolean, path: string) => {
    const mockClasses: Record<string, { light: string; dark: string }> = {
      'background.primary': { light: 'bg-white', dark: 'bg-gray-900' },
      'background.secondary': { light: 'bg-gray-50', dark: 'bg-gray-800' },
      'background.modal': { light: 'bg-white', dark: 'bg-gray-900' },
      'background.card': { light: 'bg-white', dark: 'bg-gray-800' },
      'background.button.primary': { light: 'bg-blue-500', dark: 'bg-blue-600' },
      'background.button.secondary': { light: 'bg-gray-200', dark: 'bg-gray-700' },
      'background.button.danger': { light: 'bg-red-500', dark: 'bg-red-600' },
      'background.divider': { light: 'bg-gray-200', dark: 'bg-gray-700' },
      'text.primary': { light: 'text-gray-900', dark: 'text-white' },
      'text.secondary': { light: 'text-gray-600', dark: 'text-gray-300' },
      'text.muted': { light: 'text-gray-500', dark: 'text-gray-400' },
      'text.button.primary': { light: 'text-white', dark: 'text-white' },
      'text.button.secondary': { light: 'text-gray-700', dark: 'text-gray-200' },
      'text.button.ghost': { light: 'text-blue-600', dark: 'text-blue-400' },
      'border.primary': { light: 'border-gray-300', dark: 'border-gray-600' },
      'border.secondary': { light: 'border-gray-200', dark: 'border-gray-700' },
      'border.input': { light: 'border-gray-300', dark: 'border-gray-600' },
      'combined.buttonSecondary': { light: 'bg-gray-200 text-gray-700', dark: 'bg-gray-700 text-gray-200' },
      'combined.inputField': { light: 'bg-white border-gray-300', dark: 'bg-gray-800 border-gray-600' },
      'combined.card': { light: 'bg-white border-gray-200', dark: 'bg-gray-800 border-gray-700' }
    };
    
    const classConfig = mockClasses[path];
    if (!classConfig) return '';
    
    return isDark ? classConfig.dark : classConfig.light;
  })
}));

describe('classUtils', () => {
  describe('combineClasses', () => {
    it('should combine valid classes', () => {
      const result = combineClasses('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      const result = combineClasses('class1', null, undefined, false, 'class2', '');
      expect(result).toBe('class1 class2');
    });

    it('should handle empty input', () => {
      const result = combineClasses();
      expect(result).toBe('');
    });

    it('should handle all falsy values', () => {
      const result = combineClasses(null, undefined, false, '');
      expect(result).toBe('');
    });

    it('should trim extra spaces', () => {
      const result = combineClasses('  class1  ', '  class2  ');
      expect(result).toBe('class1   class2');
    });
  });

  describe('createThemeClasses', () => {
    it('should create light theme classes', () => {
      const classes = createThemeClasses(false);
      
      expect(classes.background.primary).toBe('bg-white');
      expect(classes.background.secondary).toBe('bg-gray-50');
      expect(classes.text.primary).toBe('text-gray-900');
      expect(classes.text.secondary).toBe('text-gray-600');
      expect(classes.border.primary).toBe('border-gray-300');
    });

    it('should create dark theme classes', () => {
      const classes = createThemeClasses(true);
      
      expect(classes.background.primary).toBe('bg-gray-900');
      expect(classes.background.secondary).toBe('bg-gray-800');
      expect(classes.text.primary).toBe('text-white');
      expect(classes.text.secondary).toBe('text-gray-300');
      expect(classes.border.primary).toBe('border-gray-600');
    });

    it('should have nested button classes', () => {
      const lightClasses = createThemeClasses(false);
      const darkClasses = createThemeClasses(true);
      
      expect(lightClasses.background.button.primary).toBe('bg-blue-500');
      expect(darkClasses.background.button.primary).toBe('bg-blue-600');
      
      expect(lightClasses.text.button.primary).toBe('text-white');
      expect(darkClasses.text.button.primary).toBe('text-white');
    });

    it('should have combined classes', () => {
      const lightClasses = createThemeClasses(false);
      const darkClasses = createThemeClasses(true);
      
      expect(lightClasses.combined.buttonSecondary).toBe('bg-gray-200 text-gray-700');
      expect(darkClasses.combined.buttonSecondary).toBe('bg-gray-700 text-gray-200');
    });
  });

  describe('createStateClasses', () => {
    it('should create classes based on boolean conditions', () => {
      const conditions = {
        'active': true,
        'disabled': false,
        'loading': true
      };
      
      const result = createStateClasses(conditions);
      expect(result).toBe('active loading');
    });

    it('should create classes based on string conditions', () => {
      const conditions = {
        'size-large': 'large',
        'color-blue': 'blue',
        'variant-outline': ''
      };
      
      const result = createStateClasses(conditions);
      expect(result).toBe('size-large color-blue');
    });

    it('should handle mixed boolean and string conditions', () => {
      const conditions = {
        'active': true,
        'size-medium': 'medium',
        'disabled': false,
        'color-red': ''
      };
      
      const result = createStateClasses(conditions);
      expect(result).toBe('active size-medium');
    });

    it('should handle empty conditions', () => {
      const result = createStateClasses({});
      expect(result).toBe('');
    });
  });

  describe('createResponsiveClasses', () => {
    it('should combine base classes with conditional classes', () => {
      const baseClasses = 'p-4 rounded';
      const conditionalClasses = {
        'md:p-6': true,
        'lg:p-8': false,
        'xl:p-10': true
      };
      
      const result = createResponsiveClasses(baseClasses, conditionalClasses);
      expect(result).toBe('p-4 rounded md:p-6 xl:p-10');
    });

    it('should handle empty base classes', () => {
      const conditionalClasses = {
        'md:p-6': true,
        'lg:p-8': false
      };
      
      const result = createResponsiveClasses('', conditionalClasses);
      expect(result).toBe('md:p-6');
    });

    it('should handle empty conditional classes', () => {
      const result = createResponsiveClasses('p-4 rounded', {});
      expect(result).toBe('p-4 rounded');
    });
  });

  describe('createButtonClasses', () => {
    it('should create primary button classes', () => {
      const result = createButtonClasses(false, 'primary', 'medium');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('text-white');
    });

    it('should create secondary button classes', () => {
      const result = createButtonClasses(false, 'secondary', 'medium');
      expect(result).toContain('bg-gray-200');
      expect(result).toContain('text-gray-700');
    });

    it('should create danger button classes', () => {
      const result = createButtonClasses(false, 'danger', 'medium');
      expect(result).toContain('bg-red-500');
      expect(result).toContain('text-white');
    });

    it('should handle different sizes', () => {
      const smallButton = createButtonClasses(false, 'primary', 'small');
      const mediumButton = createButtonClasses(false, 'primary', 'medium');
      const largeButton = createButtonClasses(false, 'primary', 'large');
      
      expect(smallButton).toContain('px-3 py-1.5 text-sm');
      expect(mediumButton).toContain('px-4 py-2 text-base');
      expect(largeButton).toContain('px-6 py-3 text-lg');
    });

    it('should handle disabled state', () => {
      const result = createButtonClasses(false, 'primary', 'medium', true);
      expect(result).toContain('opacity-50 cursor-not-allowed');
    });

    it('should adapt to dark theme', () => {
      const lightButton = createButtonClasses(false, 'primary', 'medium');
      const darkButton = createButtonClasses(true, 'primary', 'medium');
      
      expect(lightButton).toContain('bg-blue-500');
      expect(darkButton).toContain('bg-blue-600');
    });

    it('should handle outline variant', () => {
      const result = createButtonClasses(false, 'outline', 'medium');
      expect(result).toContain('border-2');
      expect(result).toContain('bg-transparent');
    });

    it('should handle ghost variant', () => {
      const result = createButtonClasses(false, 'ghost', 'medium');
      expect(result).toContain('bg-transparent');
      expect(result).toContain('text-blue-600');
    });
  });

  describe('createInputClasses', () => {
    it('should create outline input classes', () => {
      const result = createInputClasses(false, 'outline', 'medium');
      expect(result).toContain('border');
      expect(result).toContain('bg-white');
      expect(result).toContain('border-gray-300');
    });

    it('should create filled input classes', () => {
      const result = createInputClasses(false, 'filled', 'medium');
      expect(result).toContain('bg-gray-50');
    });

    it('should handle different sizes', () => {
      const smallInput = createInputClasses(false, 'outline', 'small');
      const mediumInput = createInputClasses(false, 'outline', 'medium');
      const largeInput = createInputClasses(false, 'outline', 'large');
      
      expect(smallInput).toContain('px-3 py-1.5 text-sm');
      expect(mediumInput).toContain('px-4 py-2 text-base');
      expect(largeInput).toContain('px-5 py-3 text-lg');
    });

    it('should handle error state', () => {
      const result = createInputClasses(false, 'outline', 'medium', true);
      expect(result).toContain('border-red-500');
      expect(result).toContain('focus:border-red-500');
    });

    it('should handle focused state', () => {
      const result = createInputClasses(false, 'outline', 'medium', false, true);
      expect(result).toContain('ring-2');
      expect(result).toContain('ring-blue-500');
    });

    it('should handle disabled state', () => {
      const result = createInputClasses(false, 'outline', 'medium', false, false, true);
      expect(result).toContain('opacity-50');
      expect(result).toContain('cursor-not-allowed');
    });

    it('should adapt to dark theme', () => {
      const lightInput = createInputClasses(false, 'outline', 'medium');
      const darkInput = createInputClasses(true, 'outline', 'medium');
      
      expect(lightInput).toContain('bg-white');
      expect(lightInput).toContain('border-gray-300');
      expect(darkInput).toContain('bg-gray-800');
      expect(darkInput).toContain('border-gray-600');
    });

    it('should combine multiple states', () => {
      const result = createInputClasses(true, 'filled', 'large', true, true, false);
      
      expect(result).toContain('px-5 py-3 text-lg'); // large size
      expect(result).toContain('border-red-500'); // error state
      expect(result).toContain('ring-2'); // focused state
    });
  });
});