import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download } from "lucide-react";

interface JsonOutputSectionProps {
  jsonOutput: string;
  onCopy: () => void;
  onDownload: () => void;
}

export const JsonOutputSection = ({ jsonOutput, onCopy, onDownload }: JsonOutputSectionProps) => {
  return (
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
            onClick={onCopy} 
            disabled={!jsonOutput}
            variant="outline"
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button 
            onClick={onDownload}
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
  );
};