import { MarkedExtension, Tokens } from 'marked';

/**
 * GitHubスタイルのアラート（警告ブロック）をサポートする拡張
 * 構文: > [!NOTE], > [!WARNING], > [!IMPORTANT], > [!TIP], > [!CAUTION]
 */
export function githubAlerts(): MarkedExtension {
  return {
    extensions: [
      {
        name: 'githubAlert',
        level: 'block',
        start(src: string) {
          return src.match(/^>\s*\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)?.index;
        },
        tokenizer(src: string) {
          const rule = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*\n?)*)/;
          const match = rule.exec(src);

          if (match) {
            const type = match[1];
            const content = match[2]
              .split('\n')
              .map(line => line.replace(/^>\s?/, ''))
              .join('\n')
              .trim();

            return {
              type: 'githubAlert',
              raw: match[0],
              alertType: type.toLowerCase(),
              text: content
            };
          }
          return undefined;
        },
        renderer(token: any) {
          const icons = {
            note: '📘',
            tip: '💡',
            important: '❗',
            warning: '⚠️',
            caution: '🚫'
          };

          const titles = {
            note: 'Note',
            tip: 'Tip',
            important: 'Important',
            warning: 'Warning',
            caution: 'Caution'
          };

          const type = token.alertType;
          const icon = icons[type as keyof typeof icons] || '📌';
          const title = titles[type as keyof typeof titles] || 'Alert';

          return `
<div class="alert alert-${type}">
  <div class="alert-title">
    <span class="alert-icon">${icon}</span>
    <strong>${title}</strong>
  </div>
  <div class="alert-content">${token.text}</div>
</div>`;
        }
      }
    ]
  };
}

/**
 * 脚注をサポートする拡張
 * 構文: [^1] と [^1]: 脚注の内容
 */
export function footnotes(): MarkedExtension {
  const footnoteRefs: Map<string, string> = new Map();
  let footnoteCounter = 0;

  return {
    extensions: [
      {
        name: 'footnoteRef',
        level: 'inline',
        start(src: string) {
          return src.match(/\[\^/)?.index;
        },
        tokenizer(src: string) {
          const rule = /^\[\^([^\]]+)\]/;
          const match = rule.exec(src);

          if (match) {
            const id = match[1];
            if (!footnoteRefs.has(id)) {
              footnoteCounter++;
              footnoteRefs.set(id, footnoteCounter.toString());
            }

            return {
              type: 'footnoteRef',
              raw: match[0],
              id: id,
              num: footnoteRefs.get(id)
            };
          }
          return undefined;
        },
        renderer(token: any) {
          return `<sup class="footnote-ref"><a href="#fn-${token.id}" id="fnref-${token.id}">[${token.num}]</a></sup>`;
        }
      },
      {
        name: 'footnoteDefinition',
        level: 'block',
        start(src: string) {
          return src.match(/^\[\^/)?.index;
        },
        tokenizer(src: string) {
          const rule = /^\[\^([^\]]+)\]:\s*(.+?)(?=\n\n|\n\[\^|$)/s;
          const match = rule.exec(src);

          if (match) {
            const id = match[1];
            const text = match[2].trim();

            if (!footnoteRefs.has(id)) {
              footnoteCounter++;
              footnoteRefs.set(id, footnoteCounter.toString());
            }

            return {
              type: 'footnoteDefinition',
              raw: match[0],
              id: id,
              num: footnoteRefs.get(id),
              text: text
            };
          }
          return undefined;
        },
        renderer(token: any) {
          return `
<div class="footnote" id="fn-${token.id}">
  <span class="footnote-num">[${token.num}]</span>
  <span class="footnote-text">${token.text}</span>
  <a href="#fnref-${token.id}" class="footnote-backref">↩</a>
</div>`;
        }
      }
    ]
  };
}
