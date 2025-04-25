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
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Route } from "@/lib/types/Routes";
import { ApiResource, PermissionAction } from "@/lib/types/allTypes";
import { getRoutes } from "@/lib/api/routes";

function EditActionDialog({
    onSave,
    onClose,
    targetSlug,
    action,
    apiResources,
  }: {
    onSave: (updatedAction: PermissionAction) => void;
    onClose: () => void;
    targetSlug: string;
    action: PermissionAction;
    apiResources: ApiResource[];
  }) {
    const [code, setCode] = React.useState(action.code);
    const [name, setName] = React.useState(action.name);
    const [selectedResources, setSelectedResources] = React.useState<ApiResource[]>([...action.resources]);
    const [search, setSearch] = React.useState("");
  
    const [apiActions, setApiActions] = React.useState<Route[]>([])
  
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
  
    const handleSave = () => {
      if (!code.trim() || !name.trim() || selectedResources?.length === 0) return;
      onSave({
        code: code.trim(),
        name: name.trim(),
        resources: selectedResources,
      });
      onClose();
    };
  
    React.useEffect(() => {
      getRoutes().then(res => {
        setSelectedResources(res.data)
      })
    }, [])
  
    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Action</DialogTitle>
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
          <div>
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
                  {filteredResources.map((res, idx) => (
                    <CommandItem
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
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="ml-2"
            disabled={!code.trim() || !name.trim() || selectedResources?.length === 0}
            size="sm"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  export default EditActionDialog