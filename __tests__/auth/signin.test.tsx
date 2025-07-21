import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '@/pages/auth/signin';
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: jest.fn(),
  }),
}));

describe('SignIn Page', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the sign in form', () => {
    render(<SignIn />);
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows loading state when submitting', async () => {
    let resolvePromise: (value?: unknown) => void = () => {};
    (signIn as jest.Mock).mockImplementation(() => new Promise(res => { resolvePromise = res; }));

    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/signing in/i);

    resolvePromise();
  });
}); 