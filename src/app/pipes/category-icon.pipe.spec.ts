import { CategoryIconPipe } from './category-icon.pipe';

describe('CategoryIconPipe', () => {
  let pipe: CategoryIconPipe;

  beforeEach(() => {
    pipe = new CategoryIconPipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('maps every category to its emoji prefix', () => {
    expect(pipe.transform('Food')).toBe('🍔 Food');
    expect(pipe.transform('Transport')).toBe('🚗 Transport');
    expect(pipe.transform('Shopping')).toBe('🛍️ Shopping');
    expect(pipe.transform('Bills')).toBe('💡 Bills');
    expect(pipe.transform('Entertainment')).toBe('🎬 Entertainment');
    expect(pipe.transform('Other')).toBe('📦 Other');
  });

  it('falls back to Other for unknown or empty values', () => {
    expect(pipe.transform(null)).toBe('📦 Other');
    expect(pipe.transform(undefined)).toBe('📦 Other');
  });
});