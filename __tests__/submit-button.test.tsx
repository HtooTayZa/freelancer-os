import { render, screen } from '@testing-library/react'
import { SubmitButton } from '@/components/submit-button'
import { describe, it, expect, vi } from 'vitest'

// Mock the Next.js form status hook so the test doesn't crash
vi.mock('react-dom', () => ({
  ...vi.importActual('react-dom'),
  useFormStatus: () => ({ pending: false })
}))

describe('SubmitButton', () => {
  it('renders the correct text when not pending', () => {
    render(<SubmitButton>Create Project</SubmitButton>)
    expect(screen.getByText('Create Project')).toBeDefined()
  })
})