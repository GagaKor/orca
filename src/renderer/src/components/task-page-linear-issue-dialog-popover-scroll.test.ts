import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const taskPageSource = readFileSync(new URL('./TaskPage.tsx', import.meta.url), 'utf8')

/** The Linear "New Issue" dialog, up to the Jira dialog that follows it. */
function newLinearIssueDialog(): string {
  const start = taskPageSource.indexOf('open={newLinearIssueOpen}')
  const end = taskPageSource.indexOf('open={newJiraIssueOpen}', start)
  expect(start).toBeGreaterThan(-1)
  expect(end).toBeGreaterThan(start)
  return taskPageSource.slice(start, end)
}

function popoverContentClassNames(section: string): string[] {
  return [...section.matchAll(/<PopoverContent\b[^>]*?className="([^"]*)"/gs)].map((m) => m[1])
}

describe('Linear new-issue dialog popovers', () => {
  it('caps every attribute popover to the available height and opts into the wheel shim', () => {
    const classNames = popoverContentClassNames(newLinearIssueDialog())

    expect(classNames.length).toBeGreaterThanOrEqual(6)
    for (const className of classNames) {
      expect(className).toContain('popover-scroll-content')
      expect(className).toContain('scrollbar-sleek')
    }
  })

  it('leaves no fixed-height inner scroller that the outer cap would clip', () => {
    expect(newLinearIssueDialog()).not.toContain('max-h-60 overflow-y-auto scrollbar-sleek"')
  })
})
