import { Button } from "../ui/button"

const DownloadYaml = ({ yamlContent }: { yamlContent: string }) => {
    const downloadYaml = () => {
        const blob = new Blob([yamlContent], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'data.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    return (
        <Button
            onClick={downloadYaml}
            variant="secondary"
            size="sm"
        >
            Download
        </Button>
    )
}

export default DownloadYaml