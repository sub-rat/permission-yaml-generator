import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { CreditCard, Zap, Home, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./ui/command";

export type ApiResource = {
  method: string;
  path: string;
  attribute?: string;
};

export type PermissionAction = {
  code: string;
  name: string;
  resources: ApiResource[];
};

export type PermissionNode = {
  name: string;
  slug: string;
  icon: "CreditCard" | "Zap" | "Home";
  router?: string;
  component?: string;
  sequence: number;
  actions: PermissionAction[];
  children?: PermissionNode[];
};

export type MenuTableProps = {
  permissions: PermissionNode[];
  selectedActions: Set<string>;
  onAddGroup: (group: Partial<PermissionNode>) => void;
  onAddChild: (parentSlug: string, child: Partial<PermissionNode>) => void;
  onAddAction: (
    targetSlug: string,
    action: PermissionAction
  ) => void;
  onRemoveAction: (nodeSlug: string, actionCode: string) => void;
  onRemoveChild: (parentSlug: string, childSlug: string) => void;
  onEditNode: (updatedNode: PermissionNode) => void;
  onReorderGroup: (reorderedGroups: PermissionNode[]) => void;
  onReorderChild: (parentSlug: string, reorderedChildren: PermissionNode[]) => void;
  onReorderAction: (
    parentSlug: string,
    reorderedActions: PermissionAction[]
  ) => void;
  apiResources: ApiResource[];
};

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
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value as PermissionNode["icon"])}
          className="w-full rounded border border-gray-300 p-1"
          aria-label="Select Group Icon"
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
        <Button onClick={handleAdd} className="ml-2">
          Add Group
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

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
        <Button onClick={handleAdd} className="ml-2">
          Add Child
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

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
    if (!code.trim() || !name.trim() || selectedResources.length === 0) return;
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
        <div>
          <label className="block mb-1 font-semibold">Select API Resources</label>
          <Command
            value={search}
            onValueChange={setSearch}
            className="max-h-48 overflow-auto border border-gray-300 rounded"
          >
            <CommandInput placeholder="Search API resources..." />
            <CommandList>
              {filteredResources.length === 0 && (
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
          onClick={handleAdd}
          className="ml-2"
          disabled={!code.trim() || !name.trim() || selectedResources.length === 0}
        >
          Add Action
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function PermissionNodeItem({
  node,
  level = 0,
  selectedActions,
  onAddChild,
  onAddAction,
  onRemoveAction,
  onRemoveChild,
  onEditNode,
  apiResources,
}: {
  node: PermissionNode;
  level?: number;
  selectedActions: Set<string>;
  onAddChild: (parentSlug: string, child: Partial<PermissionNode>) => void;
  onAddAction: (targetSlug: string, action: PermissionAction) => void;
  onRemoveAction: (nodeSlug: string, actionCode: string) => void;
  onRemoveChild: (parentSlug: string, childSlug: string) => void;
  onEditNode: (updatedNode: PermissionNode) => void;
  apiResources: ApiResource[];
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [addChildOpen, setAddChildOpen] = React.useState(false);
  const [addActionOpen, setAddActionOpen] = React.useState(false);

  return (
    <div className="mb-4 border rounded bg-white dark:bg-gray-800 shadow-sm" style={{ marginLeft: level * 16 }}>
      <div className="flex items-center justify-between p-2 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-2">
          {React.createElement(
            {
              CreditCard: CreditCard,
              Zap: Zap,
              Home: Home,
            }[node.icon] || CreditCard,
            { className: "h-5 w-5 text-primary-foreground" }
          )}
          <span className="font-semibold">{node.name}</span>
          <span className="text-xs text-muted-foreground">({node.slug})</span>
          {node.router && <span className="ml-2 text-sm font-mono text-gray-400">{node.router}</span>}
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setAddChildOpen(true);
            }}
          >
            Add Child
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setAddActionOpen(true);
            }}
          >
            Add Action
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="p-2 space-y-2">
          {node.actions && node.actions.length > 0 && (
            <div>
              <p className="mb-1 font-medium">Actions:</p>
              <ul className="space-y-1">
                {node.actions.map((action) => (
                  <li
                    key={action.code}
                    className="flex items-center justify-between border rounded p-1"
                  >
                    <div>
                      <span className="font-semibold mr-2">{action.code}</span>
                      <span className="text-sm text-muted-foreground">{action.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({action.resources.length} resource{action.resources.length !== 1 ? 's' : ''})</span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveAction(node.slug, action.code)}
                      aria-label={`Remove action ${action.code}`}
                    >
                      &times;
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {node.children && node.children.length > 0 && (
            <div className="mt-2 space-y-2">
              {node.children
                .slice()
                .sort((a, b) => a.sequence - b.sequence)
                .map((child) => (
                  <PermissionNodeItem
                    key={child.slug}
                    node={child}
                    level={level + 1}
                    selectedActions={selectedActions}
                    onAddChild={onAddChild}
                    onAddAction={onAddAction}
                    onRemoveAction={onRemoveAction}
                    onRemoveChild={onRemoveChild}
                    onEditNode={onEditNode}
                    apiResources={apiResources}
                  />
                ))}
            </div>
          )}
        </div>
      )}
      <Dialog open={addChildOpen} onOpenChange={setAddChildOpen}>
        <AddChildDialog
          parentSlug={node.slug}
          onAdd={onAddChild}
          onClose={() => setAddChildOpen(false)}
        />
      </Dialog>
      <Dialog open={addActionOpen} onOpenChange={setAddActionOpen}>
        <AddActionDialog
          targetSlug={node.slug}
          onAdd={onAddAction}
          onClose={() => setAddActionOpen(false)}
          apiResources={apiResources}
        />
      </Dialog>
    </div>
  );
}

export function MenuTable({
  permissions,
  selectedActions,
  onAddGroup,
  onAddChild,
  onAddAction,
  onRemoveAction,
  onRemoveChild,
  onEditNode,
  onReorderGroup,
  onReorderChild,
  onReorderAction,
  apiResources,
}: MenuTableProps) {
  const [addGroupOpen, setAddGroupOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col rounded border bg-white shadow-sm p-2 overflow-auto max-h-[75vh]">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Permission Groups</h2>
        <Dialog open={addGroupOpen} onOpenChange={(open: boolean) => setAddGroupOpen(open)}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Group</span>
            </Button>
          </DialogTrigger>
          {addGroupOpen && (
            <AddGroupDialog
              onAdd={onAddGroup}
              onClose={() => setAddGroupOpen(false)}
            />
          )}
        </Dialog>
      </div>
      {permissions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No permission groups available.
        </p>
      ) : (
        <div className="space-y-2">
          {permissions
            .slice()
            .sort((a, b) => a.sequence - b.sequence)
            .map((group) => (
              <PermissionNodeItem
                key={group.slug}
                node={group}
                selectedActions={selectedActions}
                onAddChild={onAddChild}
                onAddAction={onAddAction}
                onRemoveAction={onRemoveAction}
                onRemoveChild={onRemoveChild}
                onEditNode={onEditNode}
                apiResources={apiResources}
              />
            ))}
        </div>
      )}
    </div>
  );
}
