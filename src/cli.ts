#!/usr/bin/env node

import { Command } from 'commander';
import { MarkdownToPdfConverter } from './converter';
import { ConvertOptions } from './types';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

const program = new Command();

program
  .name('md2pdf-ja')
  .description('Convert Japanese Markdown files to beautiful PDFs')
  .version('1.0.0')
  .argument('<input>', 'Input Markdown file')
  .option('-o, --output <path>', 'Output PDF file path')
  .option('-t, --title <title>', 'Document title')
  .option('-a, --author <author>', 'Document author')
  .option('--theme <theme>', 'Theme (default, academic, business)', 'default')
  .option('--format <format>', 'Page format (A4, A5, B5, Letter)', 'A4')
  .option('--css <path>', 'Custom CSS file path')
  .option('--page-numbers', 'Add page numbers', false)
  .option('--toc', 'Generate table of contents', false)
  .action(async (input: string, options: any) => {
    try {
      // 入力ファイルの存在確認
      if (!fs.existsSync(input)) {
        console.error(chalk.red(`❌ Error: Input file not found: ${input}`));
        process.exit(1);
      }

      // 出力ファイルパスの決定
      const output = options.output || input.replace(/\.md$/i, '.pdf');

      console.log(chalk.blue('📄 Converting Markdown to PDF...'));
      console.log(chalk.gray(`   Input:  ${input}`));
      console.log(chalk.gray(`   Output: ${output}`));
      if (options.theme !== 'default') {
        console.log(chalk.gray(`   Theme:  ${options.theme}`));
      }

      const convertOptions: ConvertOptions = {
        input: path.resolve(input),
        output: path.resolve(output),
        title: options.title,
        author: options.author,
        theme: options.theme,
        format: options.format,
        cssPath: options.css ? path.resolve(options.css) : undefined,
        pageNumbers: options.pageNumbers,
        toc: options.toc,
      };

      await MarkdownToPdfConverter.convertFile(convertOptions);

      console.log(chalk.green(`\n✅ Conversion completed successfully!`));
      console.log(chalk.gray(`   Output: ${output}`));

    } catch (error) {
      console.error(chalk.red('\n❌ Conversion failed:'));
      if (error instanceof Error) {
        console.error(chalk.red(`   ${error.message}`));
      } else {
        console.error(chalk.red(`   ${String(error)}`));
      }
      process.exit(1);
    }
  });

program.parse();
