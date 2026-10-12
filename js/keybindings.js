export const DEFAULT_KEYS = ['KeyD', 'KeyF', 'KeyJ', 'KeyK'];
export function isBindableKey(code) {
  return /^(Key[A-Z]|Digit[0-9]|Numpad[0-9]|Arrow(Left|Down|Up|Right)|Space|Enter|Backspace|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash|Backquote|Numpad(Add|Subtract|Multiply|Divide|Decimal|Enter))$/.test(code);
}
export function normalizeKeys(keys) {
  return Array.isArray(keys) && keys.length === 4 && keys.every(isBindableKey) && new Set(keys).size === 4
    ? [...keys] : [...DEFAULT_KEYS];
}
export function keyLabel(code) {
  if (/^Key/.test(code)) return code.slice(3);
  if (/^Digit/.test(code)) return code.slice(5);
  return ({ArrowLeft:'←', ArrowDown:'↓', ArrowUp:'↑', ArrowRight:'→', Space:'空格',
    Minus:'-', Equal:'=', BracketLeft:'[', BracketRight:']', Backslash:'\\', Semicolon:';',
    Quote:"'", Comma:',', Period:'.', Slash:'/', Backquote:'`'})[code] || code;
}
