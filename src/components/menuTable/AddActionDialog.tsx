import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { ApiResource, PermissionAction } from "@/lib/types/allTypes";
import { Label } from "../ui/label";

function AddActionDialog({
    onAdd,
    onClose,
    targetSlug,
    apiResources,
}: {
    onAdd: (targetSlug: string, action: PermissionAction) => void;
    onClose: () => void;
    targetSlug: string;
    apiResources: ApiResource[];
}) {
    const [code, setCode] = React.useState("");
    const [name, setName] = React.useState("");
    const [selectedResources, setSelectedResources] = React.useState<ApiResource[]>([]);
    const [search, setSearch] = React.useState("");

    const filteredResources = React.useMemo(() => {
        if (!search.trim()) return apiResources;
        return apiResources.filter((res) =>
            `${res.method} ${res.path}`.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, apiResources]);

    const toggleResource = (res: ApiResource) => {
        const exists = selectedResources.find(
            (r) => r.method === res.method && r.path === res.path
        );
        if (exists) {
            setSelectedResources((old) =>
                old.filter((r) => !(r.method === res.method && r.path === res.path))
            );
        } else {
            setSelectedResources((old) => [...old, res]);
        }
    };

    const isSelected = (res: ApiResource) =>
        selectedResources.find(
            (r) => r.method === res.method && r.path === res.path
        ) !== undefined;

    const handleAdd = () => {
        if (!code.trim() || !name.trim() || selectedResources?.length === 0) return;
        onAdd(targetSlug, {
            code: code.trim(),
            name: name.trim(),
            resources: selectedResources,
        });
        onClose();
        setCode("");
        setName("");
        setSelectedResources([]);
        setSearch("");
    };

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Add New Action</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
                <Input
                    placeholder="Action Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoFocus
                />

                <Input
                    placeholder="Action Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="mt-4">
                    <Label
                        className="ml-2"
                    >Search API resources...</Label>
                    <Input
                        className="mt-2"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="min-h-12 max-h-48 overflow-auto border border-gray-300 rounded">
                    {filteredResources?.length === 0 && (
                        <div className="px-4 py-2">No resources found</div>
                    )}
                    {filteredResources.slice(0, 15).map((res, idx) => {
                        return <div
                            key={`${res.method}-${res.path}-${idx}`}
                            className="px-4 py-2 border-b flex items-center"
                        >
                            <Checkbox
                                checked={isSelected(res)}
                                onClick={(e) => {
                                    if (isSelected(res)) {
                                        setSelectedResources(prev => {
                                            return prev.filter(item =>
                                                !(item.attribute == res.attribute && item.method == res.method && item.path == res.path)
                                            )
                                        })
                                    }
                                    else {
                                        setSelectedResources(prev => [...prev, res])
                                    }
                                    e.preventDefault()
                                }}
                            />
                            <span className="ml-2">
                                {res.method} {res.path}
                            </span>
                        </div>
                    })}
                </div>
                {/* <div>
                    <label className="block mb-1 font-semibold">Select API Resources</label>
                    <Command
                        value={search}
                        onValueChange={setSearch}
                        className="max-h-48 overflow-auto border border-gray-300 rounded"
                    >
                        <CommandInput placeholder="Search API resources..." />
                        <CommandList>
                            {filteredResources?.length === 0 && (
                                <CommandEmpty>No resources found</CommandEmpty>
                            )}
                            <CommandGroup>
                                {filteredResources.map((res, idx) => {
                                    return <CommandItem
                                        key={`${res.method}-${res.path}-${idx}`}
                                        onSelect={() => toggleResource(res)}
                                        className="space-x-2 flex items-center"
                                    >
                                        <Checkbox
                                            checked={isSelected(res)}
                                            onClick={(e) => e.preventDefault()}
                                        />
                                        <span className="ml-2">
                                            {res.method} {res.path}
                                        </span>
                                    </CommandItem>
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div> */}

            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleAdd}
                    className="ml-2"
                    disabled={!code.trim() || !name.trim() || selectedResources?.length === 0}
                    size="sm"
                >
                    Add Action
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default AddActionDialog