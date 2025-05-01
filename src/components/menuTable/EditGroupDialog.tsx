import { PermissionNode } from "@/lib/types/allTypes";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { iconSelectOptions } from "@/lib/data/data";
import Select from "react-select";

// Add / Edit Group Dialog with full editing capabilities
function EditGroupDialog({
    group,
    onSave,
    onClose,
    onRemoveAction
}: {
    group: PermissionNode;
    onSave: (updatedGroup: PermissionNode) => void;
    onClose: () => void;
    onRemoveAction: (nodeSlug: string, actionCode: string) => void;
}) {
    const [name, setName] = useState(group.name);
    const [slug, setSlug] = useState(group.slug ?? group.id);
    const [icon, setIcon] = useState<PermissionNode["icon"]>(group.icon);
    const [router, setRouter] = useState(group.router || "");
    const [component, setComponent] = useState(group.component || "");

    const handleSave = () => {
        if (!name.trim() || !slug.trim()) return;
        onSave({
            ...group,
            name: name.trim(),
            slug: slug.trim(),
            icon,
            router: router.trim() || undefined,
            component: component.trim() || undefined,
        });
        onClose();
    };

    const formatOptionLabel = ({ value, label, icon }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {icon}
            <span style={{ marginLeft: 8 }}>{label}</span>
        </div>
    )

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Permission Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
                <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <Input
                    placeholder="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />
                <Input
                    placeholder="Route Path (optional)"
                    value={router}
                    onChange={(e) => setRouter(e.target.value)}
                />
                <Input
                    placeholder="Component Path (optional)"
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                />
                <Select
                    options={iconSelectOptions}
                    formatOptionLabel={formatOptionLabel}
                    onChange={(e) => setIcon(e.value as PermissionNode["icon"])}
                >
                </Select>
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
                <Button
                    onClick={() => {
                        const identifier = group.slug ?? group.id

                        onRemoveAction(identifier, "deleteGroup")
                    }}
                    disabled={!name.trim() || !slug.trim()}
                    className="ml-2"
                    size="sm"
                    variant="destructive"
                >
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default EditGroupDialog