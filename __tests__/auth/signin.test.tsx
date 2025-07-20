import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn, { ERROR_INVALID_CREDENTIALS } from '@/pages/auth/signin';
import { signIn } from 'next-auth/react';

// Мокаем signIn из next-auth/react
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

  // Button should be disabled if fields are empty
  it('disables sign in button when fields are empty', () => {
    render(<SignIn />);
    const button = screen.getByRole('button', { name: /sign in/i });

    // Оба поля пустые
    expect(button).toBeDisabled();

    // Только email заполнен
    userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    expect(button).toBeDisabled();

    // Очищаем email, только password заполнен
    userEvent.clear(screen.getByPlaceholderText(/email/i));
    userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');
    expect(button).toBeDisabled();
  });

  // Button should be enabled when fields are filled
  it('enables sign in button when fields are filled', async () => {
    render(<SignIn />);
    const button = screen.getByRole('button', { name: /sign in/i });

    // Изначально disabled
    expect(button).toBeDisabled();

    // Заполняем email и password
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');

    // Теперь кнопка должна быть enabled
    expect(button).toBeEnabled();
  });

  // Should call signIn on submit
  it('calls signIn with correct credentials on submit', async () => {
    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(button);

    expect(signIn).toHaveBeenCalledWith('credentials', {
      redirect: false,
      email: 'test@example.com',
      password: 'password123',
    });
  });

  // Should show error on failed sign in
  it('shows error message on failed sign in', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });
    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(button);

    expect(await screen.findByText(ERROR_INVALID_CREDENTIALS)).toBeInTheDocument();
  });

  // Should redirect on successful sign in
  it('redirects to home on successful sign in', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: undefined });

    render(<SignIn />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  // Should show loading state when submitting
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

    // Кнопка должна быть задизейблена и показывать "Signing in..."
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/signing in/i);

    // Завершаем промис, чтобы не было висящих асинхронных операций
    resolvePromise();
  });
}); 