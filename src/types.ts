export interface ConvertOptions {
  input: string;
  output: string;
  title?: string;
  author?: string;
  pageNumbers?: boolean;
  toc?: boolean;
  cssPath?: string;
  theme?: 'default' | 'academic' | 'business';
  format?: 'A4' | 'A5' | 'B5' | 'Letter';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}
