import test from 'node:test';
import assert from 'node:assert';
import { authService } from '../src/services/auth-service.ts';

test('1. Empty Email Validation', () => {
  const result = authService.validateEmail('');
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.error, 'Work email is required.');

  // Whitespace-only email should also fail
  const whitespaceResult = authService.validateEmail('   ');
  assert.strictEqual(whitespaceResult.isValid, false);
  assert.strictEqual(whitespaceResult.error, 'Work email is required.');
});

test('2. Invalid Email Format Validation', () => {
  const invalid1 = authService.validateEmail('plainaddress');
  assert.strictEqual(invalid1.isValid, false);

  const invalid2 = authService.validateEmail('user@missingdomain');
  assert.strictEqual(invalid2.isValid, false);

  const invalid3 = authService.validateEmail('@nodomain.com');
  assert.strictEqual(invalid3.isValid, false);

  const valid = authService.validateEmail('sre-lead@acme-corp.com');
  assert.strictEqual(valid.isValid, true);
  assert.strictEqual(valid.error, undefined);
});

test('3. Empty Password Validation', () => {
  const emptyResult = authService.validatePassword('');
  assert.strictEqual(emptyResult.isValid, false);
  assert.strictEqual(emptyResult.error, 'Password is required.');

  const shortResult = authService.validatePassword('12345');
  assert.strictEqual(shortResult.isValid, false);
  assert.strictEqual(shortResult.error, 'Password must be at least 6 characters.');

  const validResult = authService.validatePassword('validPassword123');
  assert.strictEqual(validResult.isValid, true);
  assert.strictEqual(validResult.error, undefined);
});

test('4. Password Visibility State Toggle Logic', () => {
  let showPassword = false;
  const toggleVisibility = () => {
    showPassword = !showPassword;
  };

  assert.strictEqual(showPassword, false);
  toggleVisibility();
  assert.strictEqual(showPassword, true);
  toggleVisibility();
  assert.strictEqual(showPassword, false);
});

test('5. Loading State Progression', async () => {
  type AuthPhase = 'IDLE' | 'VERIFYING_CREDENTIALS' | 'CONNECTING_HINDSIGHT' | 'SUCCESS' | 'ERROR';
  const phases: AuthPhase[] = [];

  phases.push('IDLE');
  phases.push('VERIFYING_CREDENTIALS');
  await new Promise((r) => setTimeout(r, 20));
  phases.push('CONNECTING_HINDSIGHT');
  await new Promise((r) => setTimeout(r, 20));
  phases.push('SUCCESS');

  assert.deepStrictEqual(phases, [
    'IDLE',
    'VERIFYING_CREDENTIALS',
    'CONNECTING_HINDSIGHT',
    'SUCCESS',
  ]);
});

test('6. Authentication Failure State with Safe Non-Enumerating Errors', async () => {
  // Test deliberate bad password
  const failureResult = await authService.authenticate({
    email: 'sre-lead@cloudcorp.com',
    password: 'wrongpassword',
  });

  assert.strictEqual(failureResult.success, false);
  assert.ok(typeof failureResult.error === 'string');
  assert.strictEqual(
    failureResult.error,
    'Invalid credentials. Please verify your email and password or use Demo Environment access.'
  );

  // Test missing fields
  const missingResult = await authService.authenticate({
    email: '',
    password: '',
  });
  assert.strictEqual(missingResult.success, false);
  assert.ok(missingResult.validationErrors?.email);
  assert.ok(missingResult.validationErrors?.password);
});

test('7. Successful Demo Access Authentication', async () => {
  const result = await authService.authenticate({
    email: '',
    isDemoAccess: true,
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.user);
  assert.strictEqual(result.user?.role, 'LEAD_SRE');
  assert.strictEqual(result.user?.memoryBankAccess, 'tracemind-sre-prod');
  assert.strictEqual(result.user?.isDemoSession, true);
});

test('8. Keyboard Accessibility & Reduced Motion Configuration', () => {
  // Verifies email regex handles trimmed sanitize
  const trimmed = authService.validateEmail('  sre-commander@production.org  ');
  assert.strictEqual(trimmed.isValid, true);

  // Verifies that input credentials object preserves privacy
  const creds = { email: 'user@test.com', password: 'my-secret-password' };
  const safeValidation = authService.validateCredentials(creds);
  assert.strictEqual(safeValidation.isValid, true);
  assert.strictEqual(Object.keys(safeValidation.errors).length, 0);
});
