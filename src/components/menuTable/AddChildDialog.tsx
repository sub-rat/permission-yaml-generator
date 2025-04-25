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
import Select from "react-select"
import { iconSelectOptions } from "@/lib/data/data";

function AddChildDialog({
    parentSlug,
    onAdd,
    onClose,
}: {
    parentSlug: string;
    onAdd: (parentSlug: string, child: Partial<PermissionNode>) => void;
    onClose: () => void;
}) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [icon, setIcon] = useState<PermissionNode["icon"]>("CreditCard");
    const [router, setRouter] = useState("");
    const [component, setComponent] = useState("");

    const handleAdd = () => {
        if (name.trim() && slug.trim() && router.trim() && component.trim()) {
            onAdd(parentSlug, {
                name: name.trim(),
                slug: slug.trim(),
                icon,
                router: router.trim(),
                component: component.trim(),
                sequence: 0,
                actions: [],
                children: [],
            });
            onClose();
            setName("");
            setSlug("");
            setIcon("CreditCard");
            setRouter("");
            setComponent("");
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
                <DialogTitle>Add New Child Permission</DialogTitle>
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
                    Add Child
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default AddChildDialog