const requiredVariables = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  console.error(
    `Local parity tests require the following environment variables: ${missingVariables.join(', ')}. ` +
      'No tests were started and no values were read or changed.',
  );
  process.exit(1);
}
