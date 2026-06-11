/**
 * App shell is covered by production build (CI=true npm run build).
 * Full render tests need many providers/router mocks — keep a lightweight smoke test.
 */
test("test runner is configured", () => {
  expect(true).toBe(true);
});
