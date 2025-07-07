import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download } from "lucide-react";

const Index = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const { toast } = useToast();

  const convertToElementorJson = () => {
    if (!htmlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter HTML code to convert",
        variant: "destructive"
      });
      return;
    }

    try {
      // Parse HTML input
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, 'text/html');
      
      // Format sesuai struktur Elementor terbaru
      const elementorJson = {
        title: "Converted Layout",
        type: "page",
        version: "0.4",
        page_settings: [],
        content: convertElementToElementor(doc.body)
      };

      setJsonOutput(JSON.stringify(elementorJson, null, 2));
      
      toast({
        title: "Success", 
        description: "HTML converted to Elementor JSON successfully!"
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Error",
        description: `Failed to convert HTML: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const convertElementToElementor = (element: Element): any[] => {
    const elements: any[] = [];
    
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

  const extractTailwindSettings = (element: Element): any => {
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

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard"
    });
  };

  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elementor-layout.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file has been downloaded"
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">HTML Tailwind to Elementor JSON Converter</h1>
          <p className="text-xl text-muted-foreground">Convert your HTML with Tailwind CSS classes to Elementor JSON format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>HTML Input</CardTitle>
              <CardDescription>Paste your HTML code with Tailwind CSS classes here</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="<div class='text-center p-4 bg-blue-500'>
  <h1 class='text-white text-2xl mb-4'>Hello World</h1>
  <p class='text-white'>This is a sample text</p>
  <button class='bg-white text-blue-500 px-4 py-2 rounded'>Click me</button>
</div>"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <Button onClick={convertToElementorJson} className="w-full mt-4">
                Convert to Elementor JSON
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Elementor JSON Output</CardTitle>
              <CardDescription>Generated JSON for Elementor import</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jsonOutput}
                readOnly
                placeholder="JSON output will appear here after conversion..."
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={copyToClipboard} 
                  disabled={!jsonOutput}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  onClick={downloadJson}
                  disabled={!jsonOutput}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Paste your HTML code with Tailwind CSS classes in the input area</li>
              <li>Click "Convert to Elementor JSON" to generate the JSON</li>
              <li>Copy the generated JSON or download it as a file</li>
              <li>Import the JSON into your Elementor page builder</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Note:</strong> This converter supports basic HTML elements and common Tailwind classes. 
              Complex layouts may require manual adjustments in Elementor.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
