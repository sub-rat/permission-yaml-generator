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
import Select from 'react-select'

function AddGroupDialog({
    onAdd,
    onClose,
}: {
    onAdd: (group: Partial<PermissionNode>) => void;
    onClose: () => void;
}) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [icon, setIcon] = useState<PermissionNode["icon"]>("CreditCard");

    const handleAdd = () => {
        if (name.trim() && slug.trim()) {
            onAdd({
                name: name.trim(),
                slug: slug.trim(),
                icon,
                sequence: 0,
                actions: [],
                children: [],
            });
            onClose();
            setName("");
            setSlug("");
            setIcon("CreditCard");
        }
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
                <DialogTitle>Add New Permission Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
                <Input
                    placeholder="Group Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <Input
                    placeholder="Group Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
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
                <Button onClick={handleAdd} className="ml-2" size="sm">
                    Add Group
                </Button>
            </DialogFooter>
        </DialogContent >
    );
}

export default AddGroupDialog