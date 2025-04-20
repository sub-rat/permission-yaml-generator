import React, { useState, useCallback, useEffect } from "react";
import { toast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TooltipProvider } from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/collapsible";
import { MenuTable, PermissionGroup, PermissionChild, PermissionAction, ApiResource } from "../components/MenuTable";

type PermissionGroupWithChildren = PermissionGroup & { children?: PermissionChild[]; actions?: PermissionAction[] };

const dummyApiRoutes: ApiResource[] = [
  { method: "GET", path: "/api/v1/roles" },
  { method: "POST", path: "/api/v1/users" },
  { method: "GET", path: "/api/v1/users/:id" },
  { method: "PUT", path: "/api/v1/users/:id" },
  { method: "DELETE", path: "/api/v1/users/:id" },
  { method: "GET", path: "/api/v1/users" },
  { method: "PATCH", path: "/api/v1/users/:id/disable" },
  { method: "PATCH", path: "/api/v1/users/:id/enable" },
  { method: "POST", path: "/api/v1/teachers" },
  { method: "GET", path: "/api/v1/teachers/:id" },
  { method: "PUT", path: "/api/v1/teachers/:id" },
  { method: "DELETE", path: "/api/v1/teachers/:id" },
  { method: "GET", path: "/api/v1/teachers" },
  { method: "POST", path: "/api/v1/students" },
  { method: "GET", path: "/api/v1/students/:id" },
  { method: "PUT", path: "/api/v1/students/:id" },
  { method: "DELETE", path: "/api/v1/students/:id" },
  { method: "GET", path: "/api/v1/students" },
  { method: "GET", path: "/api/v1/zodiac-signs" },
  { method: "GET", path: "/api/v1/countries" },
];

const dummyPermissionData: PermissionGroupWithChildren[] = [
  {
    name: "USERS",
    slug: "users",
    icon: "CreditCard",
    sequence: 200,
    children: [
      {
        name: "Admin",
        slug: "admin",
        icon: "Zap",
        router: "/system/admin",
        component: "system/admin/index",
        sequence: 2101,
        actions: [
          {
            code: "add",
            name: "Add Roles",
            resources: [{ method: "GET", path: "/api/v1/roles" }, { method: "POST", path: "/api/v1/users" }],
          },
          {
            code: "edit",
            name: "Edit User",
            resources: [
              { method: "GET", path: "/api/v1/users/:id" },
              { method: "PUT", path: "/api/v1/users/:id" },
            ],
          },
          {
            code: "delete",
            name: "Delete User",
            resources: [{ method: "DELETE", path: "/api/v1/users/:id" }],
          },
        ],
      },
    ],
  },
];

const PermissionEditor = () => {
  // States
  const [apiRoutes, setApiRoutes] = useState<ApiResource[]>([]);
  const [permissions, setPermissions] = useState<PermissionGroupWithChildren[]>([]);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  // Loading dummy api routes on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      await new Promise((res) => setTimeout(res, 300));
      setApiRoutes(dummyApiRoutes);
    };
    fetchRoutes();
  }, []);

  // Loading dummy permission data on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      await new Promise((res) => setTimeout(res, 300));
      setPermissions(dummyPermissionData);

      const initialSelected = new Set<string>();
      dummyPermissionData.forEach((group) => {
        group.actions?.forEach((action) => {
          initialSelected.add(`${group.slug}:${action.code}`);
        });
        group.children?.forEach((child) => {
          child.actions?.forEach((action) => {
            initialSelected.add(`${child.slug}:${action.code}`);
          });
        });
      });
      setSelectedActions(initialSelected);
    };
    fetchPermissions();
  }, []);

  // Toggle action selection
  const toggleAction = useCallback(
    (groupSlug: string, actionCode: string, enabled: boolean) => {
      setSelectedActions((prev) => {
        const newSet = new Set(prev);
        const key = `${groupSlug}:${actionCode}`;
        if (enabled) {
          newSet.add(key);
        } else {
          newSet.delete(key);
        }
        return newSet;
      });

      toast({
        title: "Permission Changed",
        description: `Action "${actionCode}" for "${groupSlug}" ${enabled ? "enabled" : "disabled"}`,
      });
    },
    []
  );

  // Editing group's fields
  const onEditGroup = (updatedGroup: PermissionGroupWithChildren) => {
    setPermissions((prev) => {
      const updated = prev.map((group) => (group.slug === updatedGroup.slug ? updatedGroup : group));
      return updated;
    });
  };

  // Editing child's fields
  const onEditChild = (parentSlug: string, updatedChild: PermissionChild) => {
    setPermissions((prev) => {
      const updated = prev.map((group) => {
        if (group.slug === parentSlug && group.children) {
          const newChildren = group.children.map((child) =>
            child.slug === updatedChild.slug ? updatedChild : child
          );
          return {
            ...group,
            children: newChildren,
          };
        }
        return group;
      });
      return updated;
    });
  };

  // Remove child from group
  const onRemoveChild = (parentSlug: string, childSlug: string) => {
    setPermissions((prev) => {
      const updated = prev.map((group) => {
        if (group.slug === parentSlug && group.children) {
          const newChildren = group.children.filter((child) => child.slug !== childSlug);
          return {
            ...group,
            children: newChildren,
          };
        }
        return group;
      });
      return updated;
    });
    toast({
      title: "Child removed",
      description: `Child with slug "${childSlug}" removed from "${parentSlug}".`,
    });
  };

  // Remove action from group or child
  const onRemoveAction = (groupSlug: string, actionCode: string) => {
    setPermissions((prev) => {
      const updated = prev.map((group) => {
        if (group.slug === groupSlug) {
          if (group.actions) {
            const filteredActions = group.actions.filter((a) => a.code !== actionCode);
            return { ...group, actions: filteredActions };
          }
        }
        if (group.children) {
          const newChildren = group.children.map((child) => {
            if (child.slug === groupSlug) {
              if (child.actions) {
                const filteredActions = child.actions.filter((a) => a.code !== actionCode);
                return { ...child, actions: filteredActions };
              }
            }
            return child;
          });
          return { ...group, children: newChildren };
        }
        return group;
      });
      return updated;
    });
    setSelectedActions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(`${groupSlug}:${actionCode}`);
      return newSet;
    });
    toast({ title: "Action removed", description: `Action "${actionCode}" removed from "${groupSlug}".` });
  };

  // Yaml generation function (unchanged)
  function generateYaml(permGroups: PermissionGroupWithChildren[]) {
    function yamlString(value: any, indent = 0): string {
      const space = "  ".repeat(indent);
      if (typeof value === "string") {
        if (value.includes("\n")) {
          return `|-\n${"  ".repeat(indent + 1)}${value.replace(/\n/g, "\n" + "  ".repeat(indent + 1))}`;
        } else {
          return `"${value}"`;
        }
      }
      if (Array.isArray(value)) {
        return (
          "\n" + value.map((v) => `${space}- ${yamlString(v, indent + 1).trimStart()}`).join("\n")
        );
      }
      if (typeof value === "object" && value !== null) {
        return (
          "\n" +
          Object.entries(value)
            .map(([k, v]) => `${space}${k}: ${yamlString(v, indent + 1)}`)
            .join("\n")
        );
      }
      return String(value);
    }

    function filterActions(actions: PermissionAction[], slug: string) {
      return actions.filter((a) => selectedActions.has(`${slug}:${a.code}`));
    }

    function processGroup(group: PermissionGroupWithChildren): any {
      const result: any = {
        name: group.name,
        slug: group.slug,
        icon: group.icon,
        sequence: group.sequence,
      };

      if (group.actions && group.actions.length > 0) {
        const filteredActions = filterActions(group.actions, group.slug);
        if (filteredActions.length > 0) {
          result.actions = filteredActions.map((a) => ({
            code: a.code,
            name: a.name,
            resources: a.resources,
          }));
        }
      }

      if (group.children && group.children.length > 0) {
        const filteredChildren = group.children
          .map((c) => ({
            name: c.name,
            slug: c.slug,
            icon: c.icon,
            sequence: c.sequence,
            actions: c.actions && filterActions(c.actions, c.slug).length > 0 ? filterActions(c.actions, c.slug) : undefined,
            children: undefined,
          }))
          .filter((c) => c.actions || c.children);

        if (filteredChildren.length > 0) {
          result.children = filteredChildren;
        }
      }

      return result;
    }

    const filtered = permGroups.map((g) => processGroup(g)).filter((g) => g.actions || g.children);

    let yaml = yamlString(filtered);
    yaml = yaml.replace(/"([^"]+)"/g, "$1");

    return `- ${yaml.trimStart()}`;
  }

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupSlug, setNewGroupSlug] = useState("");
  const [newGroupIcon, setNewGroupIcon] = useState<PermissionGroupWithChildren["icon"]>("CreditCard");

  const [currentParentSlugForChild, setCurrentParentSlugForChild] = useState<string | null>(null);
  const [newChildName, setNewChildName] = useState("");
  const [newChildSlug, setNewChildSlug] = useState("");
  const [newChildIcon, setNewChildIcon] = useState<PermissionChild["icon"]>("CreditCard");
  const [newChildRouter, setNewChildRouter] = useState("");
  const [newChildComponent, setNewChildComponent] = useState("");

  const [newActionCode, setNewActionCode] = useState("");
  const [newActionName, setNewActionName] = useState("");
  const [selectedGroupOrChildForNewAction, setSelectedGroupOrChildForNewAction] = useState<{
    type: "group" | "child";
    slug: string;
  } | null>(null);

  const [selectedApiResourcesForNewAction, setSelectedApiResourcesForNewAction] = useState<ApiResource[]>([]);

  const addPermissionGroup = () => {
    if (!newGroupName.trim() || !newGroupSlug.trim()) {
      toast({
        title: "Validation error",
        description: "Name and Slug are required for new group",
      });
      return;
    }
    if (permissions.find((g) => g.slug === newGroupSlug.trim())) {
      toast({ title: "Validation error", description: "Group slug already exists" });
      return;
    }
    const newGroup: PermissionGroupWithChildren = {
      name: newGroupName.trim(),
      slug: newGroupSlug.trim(),
      icon: newGroupIcon,
      sequence: permissions.length + 1,
      children: [],
      actions: [],
    };
    setPermissions((prev) => [...prev, newGroup]);
    setNewGroupName("");
    setNewGroupSlug("");
    toast({ title: "Group added", description: `"${newGroup.name}" was added.` });
  };

  const addPermissionChild = () => {
    if (!currentParentSlugForChild) {
      toast({ title: "Internal error", description: "No parent group selected" });
      return;
    }
    if (!newChildName.trim() || !newChildSlug.trim() || !newChildRouter.trim() || !newChildComponent.trim()) {
      toast({ title: "Validation error", description: "All fields are required for child" });
      return;
    }
    setPermissions((prev) => {
      const groupIndex = prev.findIndex((g) => g.slug === currentParentSlugForChild);
      if (groupIndex === -1) return prev;

      const group = prev[groupIndex];
      if (group.children?.find((c) => c.slug === newChildSlug.trim())) {
        toast({ title: "Validation error", description: "Child slug already exists" });
        return prev;
      }
      const newChild: PermissionChild = {
        name: newChildName.trim(),
        slug: newChildSlug.trim(),
        icon: newChildIcon,
        router: newChildRouter.trim(),
        component: newChildComponent.trim(),
        sequence: (group.children?.length ?? 0) + 1,
        actions: [],
      };
      const updatedGroup = {
        ...group,
        children: [...(group.children ?? []), newChild],
      };
      const updatedPermissions = [...prev];
      updatedPermissions[groupIndex] = updatedGroup;
      return updatedPermissions;
    });
    setNewChildName("");
    setNewChildSlug("");
    setNewChildRouter("");
    setNewChildComponent("");
    setNewChildIcon("CreditCard");
    setCurrentParentSlugForChild(null);
    toast({ title: "Child added", description: `Child "${newChildName.trim()}" added successfully.` });
  };

  const addActionToGroupOrChild = () => {
    if (!selectedGroupOrChildForNewAction) {
      toast({ title: "Validation error", description: "Select group or child for new action" });
      return;
    }
    if (!newActionCode.trim() || !newActionName.trim()) {
      toast({ title: "Validation error", description: "Action code and name are required" });
      return;
    }
    if (selectedApiResourcesForNewAction.length === 0) {
      toast({ title: "Validation error", description: "Select at least one API resource for the action" });
      return;
    }

    setPermissions((prev) => {
      const updated = prev.map((group) => {
        if (selectedGroupOrChildForNewAction.type === "group" && group.slug === selectedGroupOrChildForNewAction.slug) {
          const exists = group.actions?.find((a) => a.code === newActionCode.trim());
          if (exists) {
            toast({ title: "Validation error", description: "Action code already exists in group" });
            return group;
          }
          const newAction: PermissionAction = {
            code: newActionCode.trim(),
            name: newActionName.trim(),
            resources: selectedApiResourcesForNewAction,
          };
          return {
            ...group,
            actions: [...(group.actions ?? []), newAction],
          };
        }
        if (selectedGroupOrChildForNewAction.type === "child" && group.children) {
          const newChildren = group.children.map((child) => {
            if (child.slug === selectedGroupOrChildForNewAction.slug) {
              const exists = child.actions.find((a) => a.code === newActionCode.trim());
              if (exists) {
                toast({ title: "Validation error", description: "Action code already exists in child" });
                return child;
              }
              const newAction: PermissionAction = {
                code: newActionCode.trim(),
                name: newActionName.trim(),
                resources: selectedApiResourcesForNewAction,
              };
              return {
                ...child,
                actions: [...child.actions, newAction],
              };
            }
            return child;
          });
          return { ...group, children: newChildren };
        }
        return group;
      });
      return updated;
    });

    setNewActionCode("");
    setNewActionName("");
    setSelectedGroupOrChildForNewAction(null);
    setSelectedApiResourcesForNewAction([]);
    toast({ title: "Action added", description: `Action "${newActionCode.trim()}" added successfully.` });
  };

  const onToggleActionSelected = useCallback(
    (groupSlug: string, actionCode: string, enabled: boolean) => {
      toggleAction(groupSlug, actionCode, enabled);
    },
    [toggleAction]
  );

  const apiRouteOptions = dummyApiRoutes.map((route, idx) => ({
    id: idx,
    label: `${route.method} ${route.path}`,
    value: route,
  }));

  return (
    <section className="min-h-screen max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-foreground select-none">Permission Editor</h1>
      <TooltipProvider>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left panel: Menu Table for managing existing permissions */}
          <div className="md:w-1/2 overflow-y-auto max-h-[70vh] p-2 border rounded bg-gray-50 dark:bg-gray-800">
            <MenuTable
              permissions={permissions}
              selectedActions={selectedActions}
              onToggleAction={toggleAction}
              onEditGroup={onEditGroup}
              onEditChild={onEditChild}
              onRemoveAction={onRemoveAction}
              onRemoveChild={onRemoveChild}
            />
          </div>

          {/* Right panel: Collapsible forms for adding new group, child, and actions */}
          <div className="md:w-1/2 flex flex-col gap-6 overflow-y-auto max-h-[70vh] p-4 border rounded bg-gray-50 dark:bg-gray-900">
            {/* Collapsible Add New Group */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="w-full cursor-pointer border border-purple-400 bg-purple-200 py-2 px-4 rounded-md text-center font-semibold text-purple-800 hover:bg-purple-300 transition-colors">
                Add New Permission Group
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-purple-400 rounded-b-md bg-purple-50 space-y-3">
                <Input
                  type="text"
                  placeholder="Group Name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Group Slug"
                  value={newGroupSlug}
                  onChange={(e) => setNewGroupSlug(e.target.value)}
                  className="mb-2"
                />
                <select
                  value={newGroupIcon}
                  onChange={(e) => setNewGroupIcon(e.target.value as any)}
                  className="mb-2 w-full rounded border border-purple-400 px-3 py-2 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Select Group Icon"
                >
                  <option value="CreditCard">CreditCard</option>
                  <option value="Zap">Zap</option>
                  <option value="Home">Home</option>
                </select>
                <Button onClick={addPermissionGroup} className="w-full" size="sm" variant="secondary">
                  Add Group
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Collapsible Add New Child */}
            <Collapsible>
              <CollapsibleTrigger className="w-full cursor-pointer border border-sky-400 bg-sky-200 py-2 px-4 rounded-md text-center font-semibold text-sky-800 hover:bg-sky-300 transition-colors">
                Add New Child Permission
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-sky-400 rounded-b-md bg-sky-50 space-y-3">
                <select
                  value={currentParentSlugForChild ?? ""}
                  onChange={(e) => setCurrentParentSlugForChild(e.target.value)}
                  className="mb-2 w-full rounded border border-sky-400 px-3 py-2 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  aria-label="Select Parent Group"
                >
                  <option value="" disabled>
                    Select Parent Group
                  </option>
                  {permissions.map((grp) => (
                    <option key={grp.slug} value={grp.slug}>
                      {grp.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="text"
                  placeholder="Child Name"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Child Slug"
                  value={newChildSlug}
                  onChange={(e) => setNewChildSlug(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Route Path"
                  value={newChildRouter}
                  onChange={(e) => setNewChildRouter(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Component Path"
                  value={newChildComponent}
                  onChange={(e) => setNewChildComponent(e.target.value)}
                  className="mb-2"
                />
                <select
                  value={newChildIcon}
                  onChange={(e) => setNewChildIcon(e.target.value as any)}
                  className="mb-2 w-full rounded border border-sky-400 px-3 py-2 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  aria-label="Select Child Icon"
                >
                  <option value="CreditCard">CreditCard</option>
                  <option value="Zap">Zap</option>
                  <option value="Home">Home</option>
                </select>
                <Button onClick={addPermissionChild} className="w-full" size="sm" variant="secondary">
                  Add Child
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Collapsible Add New Action */}
            <Collapsible>
              <CollapsibleTrigger className="w-full cursor-pointer border border-emerald-400 bg-emerald-200 py-2 px-4 rounded-md text-center font-semibold text-emerald-800 hover:bg-emerald-300 transition-colors">
                Add New Action
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border border-t-0 border-emerald-400 rounded-b-md bg-emerald-50 space-y-3">
                <select
                  value={selectedGroupOrChildForNewAction?.slug ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    let foundGroup = permissions.find((g) => g.slug === val);
                    if (foundGroup) {
                      setSelectedGroupOrChildForNewAction({ type: "group", slug: val });
                      return;
                    }
                    for (const g of permissions) {
                      if (g.children && g.children.find((c) => c.slug === val)) {
                        setSelectedGroupOrChildForNewAction({ type: "child", slug: val });
                        return;
                      }
                    }
                    setSelectedGroupOrChildForNewAction(null);
                  }}
                  className="w-full rounded border border-emerald-400 px-3 py-2 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Select Group or Child for Action"
                >
                  <option value="" disabled>
                    Select Group or Child
                  </option>
                  {permissions.map((grp) => (
                    <option key={`group-${grp.slug}`} value={grp.slug}>
                      {grp.name} (Group)
                    </option>
                  ))}
                  {permissions.flatMap((grp) =>
                    grp.children?.map((child) => (
                      <option key={`child-${child.slug}`} value={child.slug}>
                        {child.name} (Child)
                      </option>
                    )) ?? []
                  )}
                </select>
                <Input
                  type="text"
                  placeholder="Action Code"
                  value={newActionCode}
                  onChange={(e) => setNewActionCode(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Action Name"
                  value={newActionName}
                  onChange={(e) => setNewActionName(e.target.value)}
                />
                <label className="block mb-1 font-medium">Select API Resources</label>
                <div className="max-h-40 overflow-y-auto border border-emerald-400 rounded p-2">
                  {apiRoutes.length === 0 && <p className="text-sm text-muted-foreground">Loading routes...</p>}
                  {apiRoutes.map((route, i) => {
                    const checked = selectedApiResourcesForNewAction.some(
                      (res) => res.method === route.method && res.path === route.path
                    );
                    return (
                      <label
                        key={`${route.method}-${route.path}-${i}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedApiResourcesForNewAction((old) => [...old, route]);
                            } else {
                              setSelectedApiResourcesForNewAction((old) =>
                                old.filter((r) => !(r.method === route.method && r.path === route.path))
                              );
                            }
                          }}
                        />
                        <span className="text-emerald-900">
                          <span className="font-semibold">{route.method}</span> {route.path}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <Button onClick={addActionToGroupOrChild} className="w-full" size="sm" variant="secondary">
                  Add Action
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* YAML Output */}
            <Card className="overflow-auto">
              <CardHeader>
                <CardTitle className="text-center">Generated YAML (Selected Permissions)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[50vh] bg-gray-50 p-4 rounded font-mono text-sm whitespace-pre-wrap">
                {generateYaml(permissions)}
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </section>
  );
};

export default PermissionEditor;
