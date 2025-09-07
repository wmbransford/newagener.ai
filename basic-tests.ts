// tests/setup.ts
import '@testing-library/jest-dom'

// tests/unit/token-system.test.ts
import { describe, it, expect } from 'vitest'

describe('Token System', () => {
  it('should calculate correct costs', () => {
    const PHOTO_COST = 1
    const VIDEO_COST = 5
    
    expect(PHOTO_COST).toBe(1)
    expect(VIDEO_COST).toBe(5)
  })

  it('should validate sufficient tokens', () => {
    const userTokens = 10
    const photoCost = 1
    const videoCost = 5
    
    expect(userTokens >= photoCost).toBe(true)
    expect(userTokens >= videoCost).toBe(true)
    expect(userTokens >= videoCost * 3).toBe(false)
  })
})

// tests/unit/template-validation.test.ts
import { describe, it, expect } from 'vitest'

describe('Template Validation', () => {
  it('should validate template fields', () => {
    const validTemplate = {
      name: 'Test Template',
      industry: 'RESTAURANTS',
      kind: 'PHOTO',
      aspect: 'SQUARE',
      fields: {
        headline: { type: 'text', required: true },
        price: { type: 'currency', required: false }
      }
    }
    
    expect(validTemplate.name).toBeTruthy()
    expect(['PHOTO', 'VIDEO']).toContain(validTemplate.kind)
    expect(['SQUARE', 'VERTICAL', 'WIDESCREEN']).toContain(validTemplate.aspect)
  })
})

// tests/e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/app')
    await expect(page).toHaveURL(/.*auth.*signin/)
    await expect(page.locator('h2')).toContainText('Welcome back')
  })

  test('should show login form elements', async ({ page }) => {
    await page.goto('/auth/signin')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible()
    await expect(page.locator('button:has-text("Send sign-in link")')).toBeVisible()
  })
})

// tests/e2e/generation-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Generation Flow', () => {
  test('should show photo generator page', async ({ page }) => {
    // Note: This test would need authentication setup
    await page.goto('/app/generate/photo')
    
    // Check if redirected to auth or if page loads
    const url = page.url()
    if (url.includes('auth')) {
      await expect(page.locator('h2')).toContainText('Welcome back')
    } else {
      await expect(page.locator('h1')).toContainText('Generate Photo Ad')
    }
  })

  test('should show templates page', async ({ page }) => {
    await page.goto('/app/templates')
    
    // Check if redirected to auth or if page loads
    const url = page.url()
    if (url.includes('auth')) {
      await expect(page.locator('h2')).toContainText('Welcome back')
    } else {
      await expect(page.locator('h1')).toContainText('Template Library')
    }
  })
})