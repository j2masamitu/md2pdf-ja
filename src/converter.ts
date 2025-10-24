import { marked } from 'marked';
import puppeteer, { PDFOptions } from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConvertOptions } from './types';
import { getDefaultStyles } from './styles';

export class MarkdownToPdfConverter {
  private options: ConvertOptions;

  constructor(options: ConvertOptions) {
    this.options = options;
  }

  async convert(): Promise<void> {
    try {
      // Markdownファイルを読み込む
      const markdownContent = await fs.readFile(this.options.input, 'utf-8');

      // MarkdownをHTMLに変換
      const htmlContent = await this.markdownToHtml(markdownContent);

      // HTMLをPDFに変換
      await this.htmlToPdf(htmlContent);

      console.log(`✅ PDF generated successfully: ${this.options.output}`);
    } catch (error) {
      console.error('Error during conversion:', error);
      throw error;
    }
  }

  private async markdownToHtml(markdown: string): Promise<string> {
    // markedの設定
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // MarkdownをHTMLに変換
    const contentHtml = await marked(markdown);

    // カスタムCSSを読み込む（指定されている場合）
    let customCss = '';
    if (this.options.cssPath) {
      try {
        customCss = await fs.readFile(this.options.cssPath, 'utf-8');
      } catch (error) {
        console.warn(`Warning: Could not load custom CSS from ${this.options.cssPath}`);
      }
    }

    // デフォルトスタイルを取得
    const defaultStyles = getDefaultStyles(this.options.theme || 'default');

    // 完全なHTMLドキュメントを作成
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.options.title || 'Document'}</title>
  ${this.options.author ? `<meta name="author" content="${this.options.author}">` : ''}
  <style>
    ${defaultStyles}
    ${customCss}
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', (event) => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    });
  </script>
</head>
<body>
  ${this.options.title ? `<h1 style="text-align: center; margin-bottom: 2em;">${this.options.title}</h1>` : ''}
  ${this.options.author ? `<p style="text-align: center; margin-bottom: 3em; color: #666;">${this.options.author}</p>` : ''}
  <div class="content">
    ${contentHtml}
  </div>
  ${this.options.pageNumbers ? this.getPageNumberScript() : ''}
</body>
</html>
    `;

    return html;
  }

  private async htmlToPdf(html: string): Promise<void> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    try {
      const page = await browser.newPage();

      // HTMLコンテンツを設定
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // PDFオプションを構成
      const pdfOptions: PDFOptions = {
        format: (this.options.format || 'A4') as any,
        margin: this.options.margin || {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: true,
        preferCSSPageSize: false
      };

      // PDFを生成
      await page.pdf({
        path: this.options.output,
        ...pdfOptions
      });

    } finally {
      await browser.close();
    }
  }

  private getPageNumberScript(): string {
    return `
      <script>
        // ページ番号は現在Puppeteerでは限定的なサポート
        // 将来的な拡張のためのプレースホルダー
      </script>
    `;
  }

  static async convertFile(options: ConvertOptions): Promise<void> {
    const converter = new MarkdownToPdfConverter(options);
    await converter.convert();
  }
}
