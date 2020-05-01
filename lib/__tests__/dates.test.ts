import { formatPretty } from './../dates';

test('pretty formats a date that is today', () => {
  const prettyDate = formatPretty(new Date().toString());
  expect(prettyDate).toBe('less than a minute ago');
});

test('pretty formats a minimal date that is today', () => {
  const prettyDate = formatPretty(new Date().toString(), true);
  expect(prettyDate).toBe('less than a minute');
});

test('pretty formats a date that is in the past', () => {
  const prettyDate = formatPretty(new Date(1990, 4, 6).toString());
  expect(prettyDate).toBe('on May 6th, 1990');
});

test('pretty formats a minimal date that is in the past', () => {
  const prettyDate = formatPretty(new Date(1990, 4, 6).toString(), true);
  expect(prettyDate).toBe('May 6th, 1990');
});