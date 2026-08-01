#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract 3 TOPIK articles from knowledge-base.js for review"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('lib/knowledge-base.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find each article by its id
for art_id in ['topik-writing', 'topik-prep', 'topik-career']:
    idx = content.find(f"id: '{art_id}'")
    if idx == -1:
        print(f"ERROR: {art_id} not found!")
        continue
    
    # Find the start: go back to find the opening {
    open_brace = content.rfind('{', idx - 50, idx)
    # Find the closing of this article: look for the pattern after content backtick
    # Find content:` 
    content_start = content.find('content: `', idx)
    # After content starts with `, find the closing ` followed by newline and }
    search_from = content_start + len('content: `')
    close_backtick = content.find('\n`\n  },', search_from)
    if close_backtick == -1:
        close_backtick = content.find('\r\n`\r\n  },', search_from)
    
    if close_backtick != -1:
        article_text = content[idx:close_backtick + 10]
        print(f"\n{'='*80}")
        print(f"ARTICLE: {art_id}")
        print(f"{'='*80}")
        # Print line count and char count
        lines = article_text.split('\n')
        print(f"Lines: {len(lines)}, Chars: {len(article_text)}")
        print(article_text)
    else:
        print(f"ERROR: Could not find closing for {art_id}")
