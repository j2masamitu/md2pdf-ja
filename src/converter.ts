import { marked } from 'marked';
import puppeteer, { PDFOptions } from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConvertOptions } from './types';
import { getDefaultStyles } from './styles';
import markedKatex from 'marked-katex-extension';
import { gfmHeadingId, getHeadingList } from 'marked-gfm-heading-id';
import { githubAlerts, footnotes } from './extensions';

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

    // 拡張機能を追加（KaTeXを最初に読み込む）
    marked.use(gfmHeadingId());
    marked.use(githubAlerts());
    marked.use(footnotes());

    // 数式は最後に処理（他の拡張との競合を避ける）
    // KaTeXオプションをany型でキャストして渡す
    marked.use(markedKatex({
      nonStandard: false,
      // 日本語などのUnicode文字を許可（strict: false で警告を抑制）
      strict: 'ignore',
      trust: true
    } as any));

    // MarkdownをHTMLに変換
    const contentHtml = await marked(markdown);

    // デバッグ用: 変換後のコンテンツHTMLを出力（開発時のみ）
    if (process.env.DEBUG_HTML) {
      const debugPath = this.options.output.replace('.pdf', '.content.html');
      await fs.writeFile(debugPath, contentHtml, 'utf-8');
      console.log(`🔍 Debug content HTML saved to: ${debugPath}`);
    }

    // 目次を生成（オプションが有効な場合）
    let tocHtml = '';
    if (this.options.toc) {
      const headings = getHeadingList();
      tocHtml = this.generateToc(headings);
    }

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
  <base href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/">
  <title>${this.options.title || 'Document'}</title>
  ${this.options.author ? `<meta name="author" content="${this.options.author}">` : ''}
  <link rel="stylesheet" href="katex.min.css">
  <style>
    /* デバッグ用: KaTeX要素の表示状態を確認 */
    .katex-mathml {
      display: none !important;
      visibility: hidden !important;
    }
    .katex-html {
      display: inline !important;
      visibility: visible !important;
    }
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
  ${tocHtml}
  <div class="content">
    ${contentHtml}
  </div>
  ${this.options.pageNumbers ? this.getPageNumberScript() : ''}
</body>
</html>
    `;

    // デバッグ用: 完全なHTMLを出力（開発時のみ）
    if (process.env.DEBUG_HTML) {
      const fullDebugPath = this.options.output.replace('.pdf', '.full.html');
      await fs.writeFile(fullDebugPath, html, 'utf-8');
      console.log(`🔍 Debug full HTML saved to: ${fullDebugPath}`);
    }

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

      // デバッグ用: リクエストをログ出力
      if (process.env.DEBUG_HTML) {
        page.on('response', async (response) => {
          const url = response.url();
          if (url.includes('katex')) {
            console.log(`📥 KaTeX resource loaded: ${url} - Status: ${response.status()}`);
          }
        });
        page.on('requestfailed', (request) => {
          console.log(`❌ Request failed: ${request.url()}`);
        });
      }

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

  private generateToc(headings: any[]): string {
    if (!headings || headings.length === 0) {
      return '';
    }

    let tocItems = '';
    for (const heading of headings) {
      const indent = (heading.level - 1) * 1.5;
      tocItems += `
        <div class="toc-item toc-level-${heading.level}" style="margin-left: ${indent}em;">
          <a href="#${heading.id}">${heading.text}</a>
        </div>
      `;
    }

    return `
      <div class="toc">
        <h2>目次</h2>
        ${tocItems}
      </div>
    `;
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
