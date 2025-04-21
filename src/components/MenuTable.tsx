
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
import {
  PermissionGroup as PermissionGroupType,
  PermissionChild,
  PermissionAction,
  ApiResource,
} from "./PermissionGroup";


export type MenuTableProps = {
  permissions: PermissionGroupType[];
  selectedActions: Set<string>;
  onToggleAction: (
    groupSlug: string,
    actionCode: string,
    enabled: boolean
  ) => void;
  onEditGroup: (updatedGroup: PermissionGroupType) => void;
  onEditChild: (parentSlug: string, updatedChild: PermissionChild) => void;
  onRemoveAction: (groupSlug: string, actionCode: string) => void;
  onRemoveChild: (parentSlug: string, childSlug: string) => void;
  onAddGroup: (group: Partial<PermissionGroupType>) => void;
  onAddChild: (parentSlug: string, child: Partial<PermissionChild>) => void;
  onAddAction: (
    targetType: "group" | "child",
    targetSlug: string,
    action: PermissionAction
  ) => void;
  onReorderGroup: (reorderedGroups: PermissionGroupType[]) => void;
  onReorderChild: (
    parentSlug: string,
    reorderedChildren: PermissionChild[]
  ) => void;
  onReorderAction: (
    parentType: "group" | "child",
    parentSlug: string,
    reorderedActions: PermissionAction[]
  ) => void;
  apiResources: ApiResource[];
};

function AddGroupDialog({
  onAdd,
  onClose,
}: {
  onAdd: (group: Partial<PermissionGroupType>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState<PermissionGroupType["icon"]>("CreditCard");

  const handleAdd = () => {
    if (name.trim() && slug.trim()) {
      onAdd({
        name: name.trim(),
        slug: slug.trim(),
        icon,
        sequence: 0,
        children: [],
        actions: [],
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
          onChange={(e) => setIcon(e.target.value as PermissionGroupType["icon"])}
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
  targetType,
  targetSlug,
  apiResources,
}: {
  onAdd: (
    targetType: "group" | "child",
    targetSlug: string,
    action: PermissionAction
  ) => void;
  onClose: () => void;
  targetType: "group" | "child";
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
                      // Allow toggling on click since CommandItem triggers onSelect
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
  const [expandedGroupSlug, setExpandedGroupSlug] = React.useState<string | null>(
    null
  );
  const [addGroupOpen, setAddGroupOpen] = React.useState(false);
  const [addChildOpenForParent, setAddChildOpenForParent] = React.useState<string | null>(
    null
  );
  const [
    addActionOpenFor,
    setAddActionOpenFor,
  ] = React.useState<{ type: "group" | "child"; slug: string } | null>(null);

  // Group list drag and drop state
  const [draggingGroupSlug, setDraggingGroupSlug] = React.useState<string | null>(null);

  // Children drag and drop state
  const [draggingChild, setDraggingChild] = React.useState<{
    parentSlug: string;
    childSlug: string;
  } | null>(null);

  // Actions drag and drop state
  const [draggingAction, setDraggingAction] = React.useState<{
    parentType: "group" | "child";
    parentSlug: string;
    actionCode: string;
  } | null>(null);

  // Drag handlers for groups
  const onDragStartGroup = (e: React.DragEvent<HTMLDivElement>, slug: string) => {
    setDraggingGroupSlug(slug);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", slug);
  };

  const onDragOverGroup = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropGroup = (e: React.DragEvent<HTMLDivElement>, dropSlug: string) => {
    e.preventDefault();
    if (!draggingGroupSlug || draggingGroupSlug === dropSlug) return;

    const fromIndex = permissions.findIndex((g) => g.slug === draggingGroupSlug);
    const toIndex = permissions.findIndex((g) => g.slug === dropSlug);
    if (fromIndex === -1 || toIndex === -1) return;

    const newGroups = [...permissions];
    const [moved] = newGroups.splice(fromIndex, 1);
    newGroups.splice(toIndex, 0, moved);

    const sequencedGroups = newGroups.map((g, idx) => ({ ...g, sequence: idx + 1 }));

    onReorderGroup(sequencedGroups);
    setDraggingGroupSlug(null);
  };

  // Drag handlers for children
  const onDragStartChild = (
    e: React.DragEvent<HTMLDivElement>,
    parentSlug: string,
    childSlug: string
  ) => {
    setDraggingChild({ parentSlug, childSlug });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", childSlug);
  };

  const onDragOverChild = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropChild = (
    e: React.DragEvent<HTMLDivElement>,
    parentSlug: string,
    dropChildSlug: string
  ) => {
    e.preventDefault();
    if (
      !draggingChild ||
      draggingChild.parentSlug !== parentSlug ||
      draggingChild.childSlug === dropChildSlug
    )
      return;

    const group = permissions.find((g) => g.slug === parentSlug);
    if (!group || !group.children) return;

    const fromIndex = group.children.findIndex((c) => c.slug === draggingChild.childSlug);
    const toIndex = group.children.findIndex((c) => c.slug === dropChildSlug);
    if (fromIndex === -1 || toIndex === -1) return;

    const newChildren = [...group.children];
    const [moved] = newChildren.splice(fromIndex, 1);
    newChildren.splice(toIndex, 0, moved);

    const sequencedChildren = newChildren.map((c, idx) => ({ ...c, sequence: idx + 1 }));

    onReorderChild(parentSlug, sequencedChildren);
    setDraggingChild(null);
  };

  // Drag handlers for actions
  const onDragStartAction = (
    e: React.DragEvent<HTMLDivElement>,
    parentType: "group" | "child",
    parentSlug: string,
    actionCode: string
  ) => {
    setDraggingAction({ parentType, parentSlug, actionCode });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", actionCode);
  };

  const onDragOverAction = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropAction = (
    e: React.DragEvent<HTMLDivElement>,
    parentType: "group" | "child",
    parentSlug: string,
    dropActionCode: string
  ) => {
    e.preventDefault();
    if (
      !draggingAction ||
      draggingAction.parentType !== parentType ||
      draggingAction.parentSlug !== parentSlug ||
      draggingAction.actionCode === dropActionCode
    )
      return;

    const group = permissions.find((g) => g.slug === parentSlug);

    let actions: PermissionAction[] | undefined = undefined;

    if (parentType === "group" && group) actions = group.actions;
    else if (parentType === "child" && group && group.children) {
      const child = group.children.find((c) => c.slug === parentSlug);
      if (child) actions = child.actions;
    }
    if (!actions) return;

    const fromIndex = actions.findIndex((a) => a.code === draggingAction.actionCode);
    const toIndex = actions.findIndex((a) => a.code === dropActionCode);
    if (fromIndex === -1 || toIndex === -1) return;

    const newActions = [...actions];
    const [moved] = newActions.splice(fromIndex, 1);
    newActions.splice(toIndex, 0, moved);

    onReorderAction(parentType, parentSlug, newActions);

    setDraggingAction(null);
  };

  const [currentGroupForDetail, setCurrentGroupForDetail] = React.useState<
    PermissionGroupType | null
  >(null);

  const openGroupDetails = (group: PermissionGroupType) => {
    setCurrentGroupForDetail(group);
  };

  const closeGroupDetails = () => {
    setCurrentGroupForDetail(null);
  };

  // Render groups list
  const renderGroupList = () => (
    <div className="max-h-[75vh] w-72 min-w-[18rem] overflow-auto border-r bg-gray-50 dark:bg-gray-800 p-2">
      <div className="flex justify-between mb-2">
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
      {permissions.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No permission groups available.
        </p>
      )}
      <div className="space-y-1">
        {permissions
          .slice()
          .sort((a, b) => a.sequence - b.sequence)
          .map((group) => (
            <div
              key={group.slug}
              draggable
              onDragStart={(e) => onDragStartGroup(e, group.slug)}
              onDragOver={onDragOverGroup}
              onDrop={(e) => onDropGroup(e, group.slug)}
              className={`cursor-move rounded-md p-2 ${
                currentGroupForDetail?.slug === group.slug
                  ? "bg-indigo-100 dark:bg-indigo-900 font-semibold"
                  : "hover:bg-indigo-50 dark:hover:bg-indigo-950"
              }`}
              onClick={() => openGroupDetails(group)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {React.createElement(
                    {
                      CreditCard: CreditCard,
                      Zap: Zap,
                      Home: Home,
                    }[group.icon] || CreditCard,
                    { className: "h-5 w-5 text-primary-foreground" }
                  )}
                  <span>{group.name}</span>
                </div>
                <span className="text-sm text-muted-foreground select-none">
                  Seq: {group.sequence}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Render the selected group's permission details on the right
  const renderGroupDetails = () => {
    if (!currentGroupForDetail) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
          <p>Select a group to view its details</p>
        </div>
      );
    }

    const group = currentGroupForDetail;

    return (
      <div className="max-h-[75vh] overflow-auto flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded border">
        <div className="mb-4 space-y-4">

          {/* Children section */}
          {group.children && group.children.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-lg">Children</h3>
              <div className="space-y-2">
                {group.children
                  .slice()
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((child) => (
                    <div
                      key={child.slug}
                      draggable
                      onDragStart={(e) => onDragStartChild(e, group.slug, child.slug)}
                      onDragOver={onDragOverChild}
                      onDrop={(e) => onDropChild(e, group.slug, child.slug)}
                      className="rounded-md border p-2 bg-white dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2 font-semibold">
                          {React.createElement(
                            {
                              CreditCard: CreditCard,
                              Zap: Zap,
                              Home: Home,
                            }[child.icon] || CreditCard,
                            { className: "h-5 w-5 text-primary-foreground" }
                          )}
                          <span>{child.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground select-none">
                          Seq: {child.sequence}
                        </span>
                      </div>

                      {/* Actions for child */}
                      {child.actions && child.actions.length > 0 && (
                        <div className="space-y-1">
                          <h4 className="font-medium mb-1">Actions</h4>
                          {child.actions
                            .slice()
                            .map((action) => (
                              <div
                                key={action.code}
                                draggable
                                onDragStart={(e) =>
                                  onDragStartAction(e, "child", child.slug, action.code)
                                }
                                onDragOver={onDragOverAction}
                                onDrop={(e) =>
                                  onDropAction(e, "child", child.slug, action.code)
                                }
                                className="flex items-center space-x-2 rounded border p-1 cursor-move hover:bg-gray-100"
                              >
                                <Checkbox
                                  id={`${child.slug}-action-${action.code}`}
                                  checked={selectedActions.has(`${child.slug}:${action.code}`)}
                                  onCheckedChange={(checked) =>
                                    onToggleAction(child.slug, action.code, Boolean(checked))
                                  }
                                />
                                <label
                                  htmlFor={`${child.slug}-action-${action.code}`}
                                  className="select-none"
                                >
                                  {action.code}
                                </label>
                                <button
                                  onClick={() =>
                                    onRemoveAction(child.slug, action.code)
                                  }
                                  className="ml-auto text-red-600 hover:text-red-800"
                                  aria-label="Remove action"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Actions for group */}
          {group.actions && group.actions.length > 0 && (
            <div className="mt-4 space-y-1">
              <h3 className="mb-2 font-semibold text-lg">Actions</h3>
              {group.actions
                .slice()
                .map((action) => (
                  <div
                    key={action.code}
                    draggable
                    onDragStart={(e) =>
                      onDragStartAction(e, "group", group.slug, action.code)
                    }
                    onDragOver={onDragOverAction}
                    onDrop={(e) =>
                      onDropAction(e, "group", group.slug, action.code)
                    }
                    className="flex items-center space-x-2 rounded border p-1 cursor-move hover:bg-gray-100"
                  >
                    <Checkbox
                      id={`${group.slug}-action-${action.code}`}
                      checked={selectedActions.has(`${group.slug}:${action.code}`)}
                      onCheckedChange={(checked) =>
                        onToggleAction(group.slug, action.code, Boolean(checked))
                      }
                    />
                    <label
                      htmlFor={`${group.slug}-action-${action.code}`}
                      className="select-none"
                    >
                      {action.code}
                    </label>
                    <button
                      onClick={() => onRemoveAction(group.slug, action.code)}
                      className="ml-auto text-red-600 hover:text-red-800"
                      aria-label="Remove action"
                    >
                      &times;
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-4 flex space-x-2">
            <Dialog
              open={addChildOpenForParent === group.slug}
              onOpenChange={(open: boolean) => setAddChildOpenForParent(open ? group.slug : null)}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="inline-flex items-center space-x-1">
                  <Plus size={16} />
                  <span>Add Child</span>
                </Button>
              </DialogTrigger>
              {addChildOpenForParent === group.slug && (
                <AddChildDialog
                  parentSlug={group.slug}
                  onAdd={onAddChild}
                  onClose={() => setAddChildOpenForParent(null)}
                />
              )}
            </Dialog>

            <Dialog
              open={addActionOpenFor?.slug === group.slug}
              onOpenChange={(open: boolean) =>
                setAddActionOpenFor(open ? { type: "group", slug: group.slug } : null)
              }
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="inline-flex items-center space-x-1">
                  <Plus size={16} />
                  <span>Add Action</span>
                </Button>
              </DialogTrigger>
              {addActionOpenFor?.slug === group.slug && (
                <AddActionDialog
                  targetSlug={group.slug}
                  targetType="group"
                  apiResources={apiResources}
                  onAdd={onAddAction}
                  onClose={() => setAddActionOpenFor(null)}
                />
              )}
            </Dialog>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full rounded border bg-white shadow-sm">
      {renderGroupList()}
      {renderGroupDetails()}
    </div>
  );
}
