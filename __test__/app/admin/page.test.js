import "@testing-library/jest-dom"

import Admin from "@src/app/admin/page"
import { render, screen } from "@testing-library/react"

describe("Admin", () => {
  it("renders a heading", () => {
    render(<Admin />)

    const heading = screen.getByRole("heading", { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
