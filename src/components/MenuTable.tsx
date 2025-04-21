
import React, { useState, useEffect, useRef } from "react";
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
import { CreditCard, Zap, Home, MoveVertical, Edit, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";

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

export type PermissionChild = {
  name: string;
  slug: string;
  icon: "CreditCard" | "Zap" | "Home";
  router: string;
  component: string;
  sequence: number;
  actions: PermissionAction[];
};

export type PermissionGroup = {
  name: string;
  slug: string;
  icon: "CreditCard" | "Zap" | "Home";
  sequence: number;
  actions?: PermissionAction[];
  children?: PermissionChild[];
};

const iconMap = {
  CreditCard: CreditCard,
  Zap: Zap,
  Home: Home,
};

type MenuTableProps = {
  permissions: PermissionGroup[];
  selectedActions: Set<string>;
  onToggleAction: (groupSlug: string, actionCode: string, enabled: boolean) => void;
  onEditGroup: (updatedGroup: PermissionGroup) => void;
  onEditChild: (parentSlug: string, updatedChild: PermissionChild) => void;
  onRemoveAction: (groupSlug: string, actionCode: string) => void;
  onRemoveChild: (parentSlug: string, childSlug: string) => void;
  onAddGroup: (group: Partial<PermissionGroup>) => void;
  onAddChild: (parentSlug: string, child: Partial<PermissionChild>) => void;
  onAddAction: (
    targetType: "group" | "child",
    targetSlug: string,
    action: PermissionAction
  ) => void;
  onReorderGroup: (reorderedGroups: PermissionGroup[]) => void;
  onReorderChild: (parentSlug: string, reorderedChildren: PermissionChild[]) => void;
  onReorderAction: (
    parentType: "group" | "child",
    parentSlug: string,
    reorderedActions: PermissionAction[]
  ) => void;
  apiResources: ApiResource[];
};

function EditableCell({
  value,
  onChange,
  type = "text",
  className = "",
}: {
  value: string;
  onChange: (newVal: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      className={`text-sm p-1 ${className}`}
    />
  );
}

// Modal component for adding new group
function AddGroupDialog({ onAdd, onClose }: { onAdd: (group: Partial<PermissionGroup>) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState<PermissionGroup["icon"]>("CreditCard");

  const handleAdd = () => {
    if (name.trim() && slug.trim()) {
      onAdd({ name: name.trim(), slug: slug.trim(), icon, sequence: 0, children: [], actions: [] });
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
        <Input placeholder="Group Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Group Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value as PermissionGroup["icon"])}
          className="w-full rounded border border-gray-300 p-1"
          aria-label="Select Group Icon"
        >
          <option value="CreditCard">CreditCard</option>
          <option value="Zap">Zap</option>
          <option value="Home">Home</option>
        </select>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} className="ml-2">Add Group</Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Modal component for adding new child
function AddChildDialog({
  parentSlug,
  onAdd,
  onClose,
}: {
  parentSlug: string;
  onAdd: (parentSlug: string, child: Partial<PermissionChild>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState<PermissionChild["icon"]>("CreditCard");
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
        <Input placeholder="Child Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Child Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Input placeholder="Route Path" value={router} onChange={(e) => setRouter(e.target.value)} />
        <Input placeholder="Component Path" value={component} onChange={(e) => setComponent(e.target.value)} />
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value as PermissionChild["icon"])}
          className="w-full rounded border border-gray-300 p-1"
          aria-label="Select Child Icon"
        >
          <option value="CreditCard">CreditCard</option>
          <option value="Zap">Zap</option>
          <option value="Home">Home</option>
        </select>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} className="ml-2">Add Child</Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Modal component for adding new action with searchable resource selector
function AddActionDialog({
  onAdd,
  onClose,
  targetType,
  targetSlug,
  apiResources,
}: {
  onAdd: (targetType: "group" | "child", targetSlug: string, action: PermissionAction) => void;
  onClose: () => void;
  targetType: "group" | "child";
  targetSlug: string;
  apiResources: ApiResource[];
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedResources, setSelectedResources] = useState<ApiResource[]>([]);
  const [search, setSearch] = useState("");

  // Filtered resources for the searchable command menu
  const filteredResources = search.trim()
    ? apiResources.filter((res) =>
        `${res.method} ${res.path}`.toLowerCase().includes(search.toLowerCase())
      )
    : apiResources;

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
    onAdd(targetType, targetSlug, {
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
        <Input placeholder="Action Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Input placeholder="Action Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <label className="block mb-1 font-semibold">Select API Resources</label>
          <Command
            value={search}
            onValueChange={setSearch}
            className="max-h-48 overflow-auto border border-gray-300 rounded"
          >
            <CommandInput placeholder="Search API resources..." />
            <CommandList>
              {filteredResources.length === 0 && <CommandEmpty>No resources found</CommandEmpty>}
              <CommandGroup>
                {filteredResources.map((res, idx) => (
                  <CommandItem
                    key={`${res.method}-${res.path}-${idx}`}
                    onSelect={() => toggleResource(res)}
                    className="space-x-2 flex items-center"
                  >
                    <Checkbox checked={isSelected(res)} readOnly className="pointer-events-none" />
                    <span className="ml-2">{res.method} {res.path}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} className="ml-2" disabled={!code.trim() || !name.trim() || selectedResources.length === 0}>Add Action</Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function MenuTable({
  permissions,
  selectedActions,
  onToggleAction,
  onEditGroup,
  onEditChild,
  onRemoveAction,
  onRemoveChild,
  onAddGroup,
  onAddChild,
  onAddAction,
  onReorderGroup,
  onReorderChild,
  onReorderAction,
  apiResources,
}: MenuTableProps) {
  // Expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  // Dialog states for add modals
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [addChildOpenForParent, setAddChildOpenForParent] = useState<string | null>(null);
  const [addActionOpenFor, setAddActionOpenFor] = useState<{ type: "group" | "child"; slug: string } | null>(null);

  // Dragging state: track drag source info
  const [dragging, setDragging] = useState<{
    type: "group" | "child" | "action";
    parentSlug?: string;
    itemSlug: string;
  } | null>(null);

  // Drag handlers for groups
  const onDragStartGroup = (e: React.DragEvent<HTMLTableRowElement>, slug: string) => {
    setDragging({ type: "group", itemSlug: slug });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", slug);
  };

  const onDragOverGroup = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropGroup = (e: React.DragEvent<HTMLTableRowElement>, dropSlug: string) => {
    e.preventDefault();
    if (!dragging || dragging.type !== "group") return;
    if (dragging.itemSlug === dropSlug) return;

    // Reorder groups array based on drag and drop
    const fromIndex = permissions.findIndex((g) => g.slug === dragging.itemSlug);
    const toIndex = permissions.findIndex((g) => g.slug === dropSlug);
    if (fromIndex === -1 || toIndex === -1) return;

    const newGroups = [...permissions];
    const [moved] = newGroups.splice(fromIndex, 1);
    newGroups.splice(toIndex, 0, moved);

    // Update sequence numbers accordingly
    const sequencedGroups = newGroups.map((g, idx) => ({ ...g, sequence: idx + 1 }));

    onReorderGroup(sequencedGroups);
    setDragging(null);
  };

  // Drag handlers for children
  const onDragStartChild = (
    e: React.DragEvent<HTMLTableRowElement>,
    parentSlug: string,
    childSlug: string
  ) => {
    setDragging({ type: "child", parentSlug, itemSlug: childSlug });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", childSlug);
  };

  const onDragOverChild = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropChild = (
    e: React.DragEvent<HTMLTableRowElement>,
    parentSlug: string,
    dropChildSlug: string
  ) => {
    e.preventDefault();
    if (!dragging || dragging.type !== "child" || dragging.parentSlug !== parentSlug) return;
    if (dragging.itemSlug === dropChildSlug) return;

    const group = permissions.find((g) => g.slug === parentSlug);
    if (!group || !group.children) return;
    const fromIndex = group.children.findIndex((c) => c.slug === dragging.itemSlug);
    const toIndex = group.children.findIndex((c) => c.slug === dropChildSlug);
    if (fromIndex === -1 || toIndex === -1) return;

    const newChildren = [...group.children];
    const [moved] = newChildren.splice(fromIndex, 1);
    newChildren.splice(toIndex, 0, moved);

    const sequencedChildren = newChildren.map((c, idx) => ({ ...c, sequence: idx + 1 }));

    onReorderChild(parentSlug, sequencedChildren);
    setDragging(null);
  };

  // Drag handlers for actions - We allow reordering within their group or child only
  const onDragStartAction = (
    e: React.DragEvent<HTMLTableRowElement>,
    parentType: "group" | "child",
    parentSlug: string,
    actionCode: string
  ) => {
    setDragging({ type: "action", parentSlug, itemSlug: actionCode });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", actionCode);
  };

  const onDragOverAction = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropAction = (
    e: React.DragEvent<HTMLTableRowElement>,
    parentType: "group" | "child",
    parentSlug: string,
    dropActionCode: string
  ) => {
    e.preventDefault();
    if (!dragging || dragging.type !== "action" || dragging.parentSlug !== parentSlug) return;
    if (dragging.itemSlug === dropActionCode) return;

    const group = permissions.find((g) => g.slug === parentSlug);
    let actions: PermissionAction[] | undefined = undefined;
    if (parentType === "group" && group) {
      actions = group.actions;
    } else if (parentType === "child" && group && group.children) {
      const child = group.children.find((c) => c.slug === parentSlug);
      if (child) actions = child.actions;
    }
    if (!actions) return;
    const fromIndex = actions.findIndex((a) => a.code === dragging.itemSlug);
    const toIndex = actions.findIndex((a) => a.code === dropActionCode);
    if (fromIndex === -1 || toIndex === -1) return;

    const newActions = [...actions];
    const [moved] = newActions.splice(fromIndex, 1);
    newActions.splice(toIndex, 0, moved);

    const sequencedActions = newActions.map((a, idx) => ({ ...a }));

    onReorderAction(parentType, parentSlug, sequencedActions);
    setDragging(null);
  };

  const IconComponent = ({ icon }: { icon: "CreditCard" | "Zap" | "Home" }) => {
    const Icon = iconMap[icon] || CreditCard;
    return (
      <Icon className="inline-block h-5 w-5 mr-1 text-primary-foreground" />
    );
  };

  const updateGroupField = (group: PermissionGroup, field: keyof PermissionGroup, val: string) => {
    const updated = { ...group, [field]: val };
    onEditGroup(updated);
  };

  const updateChildField = (parentSlug: string, child: PermissionChild, field: keyof PermissionChild, val: string) => {
    const updated = { ...child, [field]: val };
    onEditChild(parentSlug, updated);
  };

  const handleRemoveChild = (parentSlug: string, childSlug: string) => {
    onRemoveChild(parentSlug, childSlug);
  };

  const handleRemoveAction = (groupSlug: string, actionCode: string) => {
    onRemoveAction(groupSlug, actionCode);
  };

  const ActionRow = ({
    action,
    groupSlug,
    canEdit = true,
  }: {
    action: PermissionAction;
    groupSlug: string;
    canEdit?: boolean;
  }) => {
    const isChecked = selectedActions.has(`${groupSlug}:${action.code}`);

    return (
      <TableRow
        draggable
        onDragStart={(e) => onDragStartAction(e, groupSlug.includes(":") ? "child" : "group", groupSlug, action.code)}
        onDragOver={onDragOverAction}
        onDrop={(e) => onDropAction(e, groupSlug.includes(":") ? "child" : "group", groupSlug, action.code)}
        className="cursor-move"
      >
        <TableCell className="pl-12 text-center">{action.code}</TableCell>
        <TableCell>{action.name}</TableCell>
        <TableCell>
          {action.resources.length}
          {action.resources.length === 1 ? " resource" : " resources"}
        </TableCell>
        <TableCell>
          {canEdit && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRemoveAction(groupSlug, action.code)}
              title="Remove action"
              className="inline-flex items-center space-x-1"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="w-full overflow-auto">
      <div className="mb-2 flex items-center justify-between">
        <Dialog open={addGroupOpen} onOpenChange={setAddGroupOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="inline-flex items-center space-x-2">
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

        {/* Show Add Child button only if one group is expanded */}
        {expandedGroups.size === 1 && (
          [...expandedGroups].map((slug) => (
            <Dialog key="add-child-dialog" open={addChildOpenForParent === slug} onOpenChange={(open) => setAddChildOpenForParent(open ? slug : null)}>
              <DialogTrigger asChild>
                <Button variant="outline" className="inline-flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Add Child to {slug}</span>
                </Button>
              </DialogTrigger>
              {addChildOpenForParent === slug && (
                <AddChildDialog
                  parentSlug={slug}
                  onAdd={onAddChild}
                  onClose={() => setAddChildOpenForParent(null)}
                />
              )}
            </Dialog>
          ))
        )}

        {/* Add Action button visible only if one group or child expanded */}
        {expandedGroups.size === 1 && (
          [...expandedGroups].map((slug) => {
            // Check if slug is a group or child
            let isGroup = permissions.some((g) => g.slug === slug);
            let isChild = !isGroup;
            const type = isGroup ? "group" : "child";

            return (
              <Dialog
                key="add-action-dialog"
                open={addActionOpenFor?.slug === slug}
                onOpenChange={(open) => setAddActionOpenFor(open ? { type, slug } : null)}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="inline-flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Add Action for {slug}</span>
                  </Button>
                </DialogTrigger>
                {addActionOpenFor?.slug === slug && (
                  <AddActionDialog
                    targetSlug={slug}
                    targetType={type}
                    apiResources={apiResources}
                    onAdd={onAddAction}
                    onClose={() => setAddActionOpenFor(null)}
                  />
                )}
              </Dialog>
            );
          })
        )}
      </div>

      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "70px" }}>Seq</TableHead>
            <TableHead style={{ width: "60px" }}></TableHead>
            <TableHead style={{ width: "150px" }}>Code / Name</TableHead>
            <TableHead style={{ width: "220px" }}>Slug / Action Name</TableHead>
            <TableHead style={{ width: "180px" }}>Associated Resources / Children</TableHead>
            <TableHead style={{ width: "95px" }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions
            .slice()
            .sort((a, b) => a.sequence - b.sequence)
            .map((group) => (
              <React.Fragment key={group.slug}>
                <TableRow
                  draggable
                  onDragStart={(e) => onDragStartGroup(e, group.slug)}
                  onDragOver={onDragOverGroup}
                  onDrop={(e) => onDropGroup(e, group.slug)}
                  className="cursor-move bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <TableCell className="text-center font-semibold">{group.sequence}</TableCell>
                  <TableCell className="text-center">
                    <button
                      aria-label={expandedGroups.has(group.slug) ? "Collapse group" : "Expand group"}
                      className="text-lg font-bold w-6 h-6 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (expandedGroups.has(group.slug)) {
                          const newSet = new Set(expandedGroups);
                          newSet.delete(group.slug);
                          setExpandedGroups(newSet);
                        } else {
                          setExpandedGroups(new Set([group.slug]));
                        }
                      }}
                    >
                      {expandedGroups.has(group.slug) ? "−" : "+"}
                    </button>
                  </TableCell>
                  <TableCell className="flex items-center space-x-2 font-semibold">
                    <IconComponent icon={group.icon} />
                    <EditableCell
                      value={group.name}
                      onChange={(val) => updateGroupField(group, "name", val)}
                      className="max-w-[180px]"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 select-text max-w-[140px] truncate">{group.slug}</TableCell>
                  <TableCell>
                    {group.children && group.children.length > 0
                      ? group.children.length + " children"
                      : group.actions && group.actions.length > 0
                        ? group.actions.length + (group.actions.length === 1 ? " action" : " actions")
                        : "No children or actions"}
                  </TableCell>
                  <TableCell>
                    {/* No direct remove for group here to avoid accidental deletion */}
                    {/* Could add edit/remove modals in future */}
                  </TableCell>
                </TableRow>

                {expandedGroups.has(group.slug) && (
                  <>
                    {/* Render group actions */}
                    {group.actions?.slice().sort((a, b) => 0).map((action) => (
                      <ActionRow key={`group-action-${action.code}`} groupSlug={group.slug} action={action} />
                    ))}

                    {/* Render children */}
                    {group.children?.slice().sort((a, b) => a.sequence - b.sequence).map((child) => (
                      <React.Fragment key={child.slug}>
                        <TableRow
                          draggable
                          onDragStart={(e) => onDragStartChild(e, group.slug, child.slug)}
                          onDragOver={onDragOverChild}
                          onDrop={(e) => onDropChild(e, group.slug, child.slug)}
                          className="cursor-move bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <TableCell className="text-center font-medium">{child.sequence}</TableCell>
                          <TableCell className="text-center">
                            <IconComponent icon={child.icon} />
                          </TableCell>
                          <TableCell className="font-medium max-w-[180px]">
                            <EditableCell value={child.name} onChange={(val) => updateChildField(group.slug, child, "name", val)} />
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 select-text max-w-[140px] truncate">{child.slug}</TableCell>
                          <TableCell>
                            {child.actions && child.actions.length > 0
                              ? child.actions.length + (child.actions.length === 1 ? " action" : " actions")
                              : "No actions"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveChild(group.slug, child.slug)}
                              title="Remove child"
                              className="inline-flex items-center space-x-1"
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>

                        {/* Render child's actions */}
                        {child.actions?.slice().sort((a, b) => 0).map((action) => (
                          <ActionRow
                            key={`child-action-${action.code}`}
                            groupSlug={child.slug}
                            action={action}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          {permissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No menus/permissions available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

