import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { PermissionNode } from "@/lib/types/allTypes";

// Add / Edit Child dialog (same structure for editing leaf or nested children)
function EditChildDialog({
    child,
    onSave,
    onClose,
}: {
    child: PermissionNode;
    onSave: (updatedChild: PermissionNode) => void;
    onClose: () => void;
}) {
    const [name, setName] = useState(child.name);
    const [slug, setSlug] = useState(child.slug);
    const [icon, setIcon] = useState<PermissionNode["icon"]>(child.icon);
    const [router, setRouter] = useState(child.router || "");
    const [component, setComponent] = useState(child.component || "");

    const handleSave = () => {
        if (!name.trim() || !slug.trim()) return;
        onSave({
            ...child,
            name: name.trim(),
            slug: slug.trim(),
            icon,
            router: router.trim() || undefined,
            component: component.trim() || undefined,
        });
        onClose();
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Child Permission</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
                <Input
                    placeholder="Child Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <Input
                    placeholder="Child Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />
                <Input
                    placeholder="Route Path"
                    value={router}
                    onChange={(e) => setRouter(e.target.value)}
                />
                <Input
                    placeholder="Component Path"
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                />
                <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value as PermissionNode["icon"])}
                    className="w-full rounded border border-gray-300 p-1"
                    aria-label="Select Child Icon"
                >
                    <option value="CreditCard">CreditCard</option>
                    <option value="Zap">Zap</option>
                    <option value="Home">Home</option>
                </select>
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!name.trim() || !slug.trim()}
                    className="ml-2"
                    size="sm"
                >
                    Save Changes
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default EditChildDialog