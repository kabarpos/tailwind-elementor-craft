import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface HtmlInputSectionProps {
  htmlInput: string;
  onHtmlInputChange: (value: string) => void;
  onConvert: () => void;
}

export const HtmlInputSection = ({ htmlInput, onHtmlInputChange, onConvert }: HtmlInputSectionProps) => {
  return (
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
          onChange={(e) => onHtmlInputChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
        />
        <Button onClick={onConvert} className="w-full mt-4">
          Convert to Elementor JSON
        </Button>
      </CardContent>
    </Card>
  );
};