import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '@/pages/auth/signin';

// Используем jest.mock с import, а не require:
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('SignIn Page', () => {
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
  it('calls signIn with correct credentials on submit', () => {
    // TODO: Mock signIn, fill fields, submit form, check call
  });

  // Should show error on failed sign in
  it('shows error message on failed sign in', () => {
    // TODO: Simulate signIn error and check error message
  });

  // Should redirect on successful sign in
  it('redirects to home on successful sign in', () => {
    // TODO: Simulate successful signIn and check router.push('/')
  });

  // Should show loading state when submitting
  it('shows loading state when submitting', () => {
    // TODO: Simulate isLoading and check button text/disabled
  });

  // Accessibility: fields have aria-labels
  it('has accessible labels for inputs and button', () => {
    // TODO: Check aria-labels for email, password, and button
  });

  // Enter key submits the form
  it('submits form on Enter key in password field', () => {
    // TODO: Simulate Enter key and check submit
  });
}); 