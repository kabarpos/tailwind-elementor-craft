export interface ElementorElement {
  id: string;
  elType: string;
  isInner?: boolean;
  widgetType?: string;
  settings: any;
  elements?: ElementorElement[];
}

export interface ElementorJson {
  title: string;
  type: string;
  version: string;
  page_settings: any[];
  content: ElementorElement[];
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const extractTailwindSettings = (element: Element): any => {
  const classList = element.className;
  const settings: any = {};

  // Extract common Tailwind classes and convert to Elementor settings
  if (classList.includes('text-center')) settings.align = 'center';
  if (classList.includes('text-left')) settings.align = 'left';
  if (classList.includes('text-right')) settings.align = 'right';
  
  // Extract colors
  const colorMatch = classList.match(/text-(\w+)-(\d+)/);
  if (colorMatch) {
    settings.color = `var(--e-global-color-${colorMatch[1]})`;
  }

  const bgMatch = classList.match(/bg-(\w+)-(\d+)/);
  if (bgMatch) {
    settings.background_color = `var(--e-global-color-${bgMatch[1]})`;
  }

  // Extract spacing
  const marginMatch = classList.match(/m-(\d+)/);
  if (marginMatch) {
    const value = parseInt(marginMatch[1]) * 4;
    settings.margin = { unit: 'px', top: value, right: value, bottom: value, left: value };
  }

  const paddingMatch = classList.match(/p-(\d+)/);
  if (paddingMatch) {
    const value = parseInt(paddingMatch[1]) * 4;
    settings.padding = { unit: 'px', top: value, right: value, bottom: value, left: value };
  }

  return settings;
};

export const convertElementToElementor = (element: Element): ElementorElement[] => {
  const elements: ElementorElement[] = [];
  
  Array.from(element.children).forEach(child => {
    if (child.tagName === 'DIV') {
      elements.push({
        id: generateId(),
        elType: "container",
        isInner: false,
        settings: extractTailwindSettings(child),
        elements: convertElementToElementor(child)
      });
    } else if (child.tagName === 'H1' || child.tagName === 'H2' || child.tagName === 'H3') {
      elements.push({
        id: generateId(),
        elType: "widget",
        widgetType: "heading",
        settings: {
          title: child.textContent || "",
          size: child.tagName.toLowerCase(),
          ...extractTailwindSettings(child)
        }
      });
    } else if (child.tagName === 'P') {
      elements.push({
        id: generateId(),
        elType: "widget", 
        widgetType: "text-editor",
        settings: {
          editor: child.textContent || "",
          ...extractTailwindSettings(child)
        }
      });
    } else if (child.tagName === 'BUTTON') {
      elements.push({
        id: generateId(),
        elType: "widget",
        widgetType: "button", 
        settings: {
          text: child.textContent || "",
          ...extractTailwindSettings(child)
        }
      });
    } else if (child.children.length > 0) {
      // For other elements with children, treat as container
      elements.push({
        id: generateId(),
        elType: "container",
        isInner: false,
        settings: extractTailwindSettings(child),
        elements: convertElementToElementor(child)
      });
    }
  });

  return elements;
};

export const convertHtmlToElementorJson = (htmlInput: string): ElementorJson => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlInput, 'text/html');
  
  return {
    title: "Converted Layout",
    type: "page",
    version: "0.4",
    page_settings: [],
    content: convertElementToElementor(doc.body)
  };
};