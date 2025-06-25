/**
 * Escapes special characters in text for safe use in SVG
 */
export function escapeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Parses an SVG string into an SVG element
 */
export function parseSvgString(svgString: string): SVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  return doc.documentElement as unknown as SVGElement;
}

/**
 * Creates an SVG element with the given attributes
 */
export function createSvgElement(
  tag: string,
  attributes: Record<string, string | number> = {},
  content: string = ''
): string {
  const attrs = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  if (content) {
    return `<${tag} ${attrs}>${content}</${tag}>`;
  }
  
  return `<${tag} ${attrs}/>`;
}

/**
 * Saves an SVG string as a file
 */
export function saveSvgToFile(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a path element
 */
export function createPath(d: string, attributes: Record<string, string | number> = {}): string {
  return createSvgElement('path', { d, ...attributes });
}

/**
 * Creates a circle element
 */
export function createCircle(
  cx: number,
  cy: number,
  r: number,
  attributes: Record<string, string | number> = {}
): string {
  return createSvgElement('circle', { cx, cy, r, ...attributes });
}

/**
 * Creates a rectangle element
 */
export function createRectangle(
  x: number,
  y: number,
  width: number,
  height: number,
  attributes: Record<string, string | number> = {}
): string {
  return createSvgElement('rect', { x, y, width, height, ...attributes });
}

/**
 * Creates a text element
 */
export function createText(
  x: number,
  y: number,
  text: string,
  attributes: Record<string, string | number> = {}
): string {
  return createSvgElement('text', { x, y, ...attributes }, escapeText(text));
}

/**
 * Creates a group element
 */
export function createGroup(
  attributes: Record<string, string | number> = {},
  content: string = ''
): string {
  return createSvgElement('g', attributes, content);
}

/**
 * Creates a line element
 */
export function createLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  attributes: Record<string, string | number> = {}
): string {
  return createSvgElement('line', { x1, y1, x2, y2, ...attributes });
} 
