# md2pdf-ja

日本語のMarkdownファイルを美しいPDFファイルに変換するツールです。日本語フォント、禁則処理、適切な行間設定など、日本語文書に最適化されています。

## 特徴

- 日本語フォント（Noto Sans JP / Noto Serif JP）に対応
- GitHub Flavored Markdown (GFM) サポート
- シンタックスハイライト対応
- 複数のテーマ（デフォルト、学術、ビジネス）
- カスタムCSSサポート
- 用紙サイズ指定（A4, A5, B5, Letter）

## インストール

```bash
npm install -g @j2masamitu/md2pdf-ja
```

### 開発環境セットアップ

```bash
git clone https://github.com/j2masamitu/md2pdf-ja
cd md2pdf-ja
npm install
npm run build
```

### ローカルでグローバルインストール（テスト用）

```bash
npm run build
npm link
```

## 使い方

### 基本的な使い方（グローバルインストール後）

```bash
md2pdf-ja sample.md
```

### オプション

```bash
# 出力ファイルを指定
md2pdf-ja input.md -o output.pdf

# タイトルと著者を指定
md2pdf-ja input.md -t "ドキュメントタイトル" -a "著者名"

# テーマを指定
md2pdf-ja input.md --theme academic

# 用紙サイズを指定
md2pdf-ja input.md --format B5

# カスタムCSSを使用
md2pdf-ja input.md --css custom.css
```

### 開発環境での使い方

```bash
# 開発モード
npm run dev sample.md

# または、ビルド後
node dist/cli.js sample.md
```

### 利用可能なオプション

- `-o, --output <path>`: 出力PDFファイルパス
- `-t, --title <title>`: ドキュメントのタイトル
- `-a, --author <author>`: 著者名
- `--theme <theme>`: テーマ (default, academic, business)
- `--format <format>`: 用紙サイズ (A4, A5, B5, Letter)
- `--css <path>`: カスタムCSSファイルのパス
- `--page-numbers`: ページ番号を追加
- `--toc`: 目次を生成

## テーマ

### デフォルト
標準的な読みやすいスタイル

### academic
学術論文向けのフォーマット

### business
ビジネス文書向けのフォーマット

## 技術スタック

- TypeScript
- Puppeteer (PDF生成)
- marked (Markdown解析)
- Commander (CLI)
- Noto Sans/Serif CJK JP (日本語フォント)

## ライセンス

MIT
