# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2025-10-27

### Fixed
- CLI `--version` コマンドが正しいバージョン番号を表示するように修正
- package.jsonから動的にバージョンを読み込むように変更

## [1.1.3] - 2025-10-27

### Fixed
- ESM互換性の問題を修正（`marked` パッケージの動的インポート対応）
- CommonJSプロジェクトから最新のESM版 `marked` パッケージを使用できるように改善

### Technical
- `marked` のインポートを動的インポートパターンに変更
- キャッシュ機構を実装してパフォーマンスを維持
- 型安全性を保ちながらESM/CJS間の互換性を確保

## [1.1.2] - 2025-10-25

### Added
- 画像の埋め込み機能（Base64エンコード）
- Windows絶対パス対応（C:\形式）
- 相対パス・絶対パスの自動解決

## [1.1.1] - 2025-10-24

### Added
- 数式レンダリング機能（KaTeX）
- GitHubアラート機能（NOTE、WARNING、IMPORTANT、TIP、CAUTION）
- 脚注機能
- 見出しIDの自動生成（GFMスタイル）
- 目次の自動生成機能（`--toc` オプション）

## [1.0.0] - 2025-10-23

### Added
- 初回リリース
- 日本語Markdown → PDF変換
- 3つのテーマ（default、academic、business）
- カスタムCSS対応
- CLIとプログラマティックAPI

[1.1.4]: https://github.com/j2masamitu/md2pdf-ja/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/j2masamitu/md2pdf-ja/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/j2masamitu/md2pdf-ja/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/j2masamitu/md2pdf-ja/compare/v1.0.0...v1.1.1
[1.0.0]: https://github.com/j2masamitu/md2pdf-ja/releases/tag/v1.0.0
