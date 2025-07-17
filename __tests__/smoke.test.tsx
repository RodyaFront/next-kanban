import { render, screen } from '@testing-library/react';

test('smoke test: renders hello', () => {
  render(<div>hello</div>);
  expect(screen.getByText('hello')).toBeInTheDocument();
});