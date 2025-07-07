import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InstructionsSection = () => {
  return (
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
  );
};