import yaml from 'js-yaml'
import { toast } from "@/hooks/use-toast";
import { messages } from "../constants/messages";

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.yaml', '.yml'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExt)) {
        toast({ title: messages.INVALID_FILE, description: messages.INVALID_FILE_DESCRIPTION });

        e.target.value = '';
        return;
    }

    try {
        const content = await readFileAsText(file)

        return content
    } catch (err) {
        toast({ title: "File error", description: messages.COULDNOT_READ_FILE });
        console.error('Error reading file:', err);
    }
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            if (event.target?.result) {
                resolve(event.target.result as string);
            } else {
                reject(new Error('File reading failed'));
            }
        };

        reader.onerror = () => {
            reject(new Error('File reading error'));
        };

        reader.readAsText(file);
    });
};

export {
    handleFileChange
}