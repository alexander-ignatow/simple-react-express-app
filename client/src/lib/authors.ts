// Mirrors the authors present in server/src/services/quoteGenerator.ts. The server owns the
// quote data and validates the `author` query itself, so a stale entry here surfaces as a
// 404 rather than a broken build — re-derive this list when the server's quotes change.
export const QUOTE_AUTHORS: readonly string[] = [
  'Batman',
  'Boromir',
  'Buzz Lightyear',
  'Captain America',
  'Darth Vader',
  'Game of Thrones',
  'Han Solo',
  'Katniss Everdeen',
  'Michael Scott',
  'Robert Frost',
  'Spock',
  'Thanos',
  'The Joker',
  'The Plastics',
  'Tyrion Lannister',
  'Uncle Ben',
  'Wayne Gretzky',
  'Yoda',
]

// Sentinel for "no author filter", used as the empty <option> value in the selector.
export const ANY_AUTHOR = ''
