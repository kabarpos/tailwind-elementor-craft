import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { convertHtmlToElementorJson } from "@/lib/elementor-converter";
import { copyToClipboard, downloadJson } from "@/lib/file-utils";
import { HtmlInputSection } from "@/components/HtmlInputSection";
import { JsonOutputSection } from "@/components/JsonOutputSection";
import { InstructionsSection } from "@/components/InstructionsSection";

const Index = () => {
  const [htmlInput, setHtmlInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const { toast } = useToast();

  const handleConvert = () => {
    if (!htmlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter HTML code to convert",
        variant: "destructive"
      });
      return;
    }

    try {
      const elementorJson = convertHtmlToElementorJson(htmlInput);
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

  const handleCopy = async () => {
    try {
      await copyToClipboard(jsonOutput);
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    try {
      downloadJson(jsonOutput);
      toast({
        title: "Downloaded!",
        description: "JSON file has been downloaded"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">HTML Tailwind to Elementor JSON Converter</h1>
          <p className="text-xl text-muted-foreground">Convert your HTML with Tailwind CSS classes to Elementor JSON format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HtmlInputSection 
            htmlInput={htmlInput}
            onHtmlInputChange={setHtmlInput}
            onConvert={handleConvert}
          />
          
          <JsonOutputSection 
            jsonOutput={jsonOutput}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        </div>

        <InstructionsSection />
      </div>
    </div>
  );
};

export default Index;
