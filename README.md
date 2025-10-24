# md2pdf-ja

日本語のMarkdownファイルを美しいPDFファイルに変換するツールです。日本語フォント、禁則処理、適切な行間設定など、日本語文書に最適化されています。

## 特徴

- 日本語フォント（Noto Sans JP / Noto Serif JP）に対応
- GitHub Flavored Markdown (GFM) サポート
- **数式のレンダリング（KaTeX）** - インライン数式 `$...$` とブロック数式 `$$...$$` に対応
- **GitHubアラート** - `[!NOTE]`, `[!WARNING]`, `[!IMPORTANT]` などの警告ブロック
- **脚注機能** - 学術文書やレポート向けの脚注サポート
- **見出しIDの自動生成** - GitHubスタイルの見出しID
- **目次の自動生成** - `--toc` オプションで目次を生成
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

## 新機能の使い方

### 数式（Math Equations）

インライン数式は `$...$` で、ブロック数式は `$$...$$` で囲みます。

```markdown
インライン数式: $E = mc^2$

ブロック数式:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### GitHubアラート（Alerts）

5種類のアラートタイプが利用できます。

```markdown
> [!NOTE]
> 重要な情報を示すノート

> [!TIP]
> 便利なヒントやアドバイス

> [!IMPORTANT]
> 非常に重要な情報

> [!WARNING]
> 注意が必要な警告

> [!CAUTION]
> 危険性についての注意喚起
```

### 脚注（Footnotes）

```markdown
この文章には脚注があります[^1]。

[^1]: これは脚注の内容です。
```

### 目次の生成

`--toc` オプションを使用すると、見出しから自動的に目次を生成します。

```bash
md2pdf-ja document.md --toc -o output.pdf
```

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
