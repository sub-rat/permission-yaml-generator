import React, { useState, useCallback, useEffect } from "react";
import yaml from "js-yaml";
import { toast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TooltipProvider } from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/collapsible";
import {
  MenuTable,
  PermissionGroup,
  PermissionChild,
  PermissionAction,
  ApiResource,
} from "../components/MenuTable";

type PermissionGroupWithChildren = PermissionGroup & {
  children?: PermissionChild[];
  actions?: PermissionAction[];
};

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
            resources: [
              { method: "GET", path: "/api/v1/roles" },
              { method: "POST", path: "/api/v1/users" },
            ],
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
  const [apiRoutes, setApiRoutes] = useState<ApiResource[]>([]);
  const [permissions, setPermissions] = useState<PermissionGroupWithChildren[]>([]);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [yamlInput, setYamlInput] = useState<string>("");

  useEffect(() => {
    const fetchRoutes = async () => {
      await new Promise((res) => setTimeout(res, 300));
      setApiRoutes(dummyApiRoutes);
    };
    fetchRoutes();
  }, []);

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

      const generatedYaml = generateYaml(dummyPermissionData);
      setYamlInput(generatedYaml);
    };
    fetchPermissions();
  }, []);

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
        return "\n" + value.map((v) => `${space}- ${yamlString(v, indent + 1).trimStart()}`).join("\n");
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
            actions:
              c.actions && filterActions(c.actions, c.slug).length > 0
                ? filterActions(c.actions, c.slug)
                : undefined,
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

  const loadPermissionsFromYaml = () => {
    try {
      const parsed = yaml.load(yamlInput);
      if (!Array.isArray(parsed)) {
        toast({ title: "Invalid YAML", description: "Top-level structure should be an array." });
        return;
      }
      const normalizedGroups = (parsed as any[]).map((group) => ({
        ...group,
        actions: group.actions ?? [],
        children:
          group.children?.map((child: any) => ({
            ...child,
            actions: child.actions ?? [],
          })) ?? [],
      })) as PermissionGroupWithChildren[];
      setPermissions(normalizedGroups);

      const newSelected = new Set<string>();
      normalizedGroups.forEach((group) => {
        group.actions?.forEach((action) => {
          newSelected.add(`${group.slug}:${action.code}`);
        });
        group.children?.forEach((child) => {
          child.actions?.forEach((action) => {
            newSelected.add(`${child.slug}:${action.code}`);
          });
        });
      });
      setSelectedActions(newSelected);
      toast({ title: "YAML loaded", description: "Permissions loaded from YAML successfully." });
    } catch (e) {
      toast({ title: "YAML Parse Error", description: (e as Error).message });
    }
  };

  useEffect(() => {
    const yamlStr = generateYaml(permissions);
    setYamlInput(yamlStr);
  }, [permissions, selectedActions]);

  const addPermissionGroup = (group: Partial<PermissionGroup>) => {
    if (!group.name || !group.slug) {
      toast({ title: "Validation error", description: "Group name and slug required." });
      return;
    }
    if (permissions.find((g) => g.slug === group.slug)) {
      toast({ title: "Validation error", description: "Group slug already exists." });
      return;
    }
    const newGroup: PermissionGroupWithChildren = {
      name: group.name,
      slug: group.slug,
      icon: group.icon || "CreditCard",
      sequence: permissions.length + 1,
      children: [],
      actions: [],
    };
    setPermissions((prev) => [...prev, newGroup]);
    toast({ title: "Group added", description: `"${group.name}" was added.` });
  };

  const addPermissionChild = (parentSlug: string, child: Partial<PermissionChild>) => {
    if (!parentSlug || !child.name || !child.slug || !child.router || !child.component) {
      toast({ title: "Validation error", description: "Child fields are all required." });
      return;
    }
    setPermissions((prev) => {
      const groupIndex = prev.findIndex((g) => g.slug === parentSlug);
      if (groupIndex === -1) return prev;
      const group = prev[groupIndex];
      if (group.children?.find((c) => c.slug === child.slug)) {
        toast({ title: "Validation error", description: "Child slug already exists." });
        return prev;
      }
      const newChild: PermissionChild = {
        name: child.name,
        slug: child.slug,
        icon: child.icon || "CreditCard",
        router: child.router,
        component: child.component,
        sequence: (group.children?.length ?? 0) + 1,
        actions: [],
      };
      const updatedGroup = {
        ...group,
        children: [...(group.children ?? []), newChild],
      };
      const updatedPermissions = [...prev];
      updatedPermissions[groupIndex] = updatedGroup;
      toast({ title: "Child added", description: `Child "${child.name}" added successfully.` });
      return updatedPermissions;
    });
  };

  const addActionToGroupOrChild = (
    targetType: "group" | "child",
    targetSlug: string,
    action: PermissionAction
  ) => {
    if (!action.code || !action.name || action.resources.length === 0) {
      toast({ title: "Validation error", description: "Action code/name/resources required." });
      return;
    }
    setPermissions((prev) => {
      return prev.map((group) => {
        if (targetType === "group" && group.slug === targetSlug) {
          if (group.actions?.find((a) => a.code === action.code)) {
            toast({ title: "Validation error", description: "Action code already exists in group" });
            return group;
          }
          return {
            ...group,
            actions: [...(group.actions ?? []), action],
          };
        }
        if (targetType === "child" && group.children) {
          const newChildren = group.children.map((child) => {
            if (child.slug === targetSlug) {
              if (child.actions.find((a) => a.code === action.code)) {
                toast({ title: "Validation error", description: "Action code already exists in child" });
                return child;
              }
              return {
                ...child,
                actions: [...child.actions, action],
              };
            }
            return child;
          });
          return { ...group, children: newChildren };
        }
        return group;
      });
    });
    toast({ title: "Action added", description: `Action "${action.code}" added successfully.` });
  };

  const reorderGroups = (newGroups: PermissionGroupWithChildren[]) => {
    setPermissions(newGroups);
  };

  const reorderChildren = (parentSlug: string, newChildren: PermissionChild[]) => {
    setPermissions((prev) =>
      prev.map((group) =>
        group.slug === parentSlug ? { ...group, children: newChildren } : group
      )
    );
  };

  const reorderActions = (
    parentType: "group" | "child",
    parentSlug: string,
    newActions: PermissionAction[]
  ) => {
    setPermissions((prev) =>
      prev.map((group) => {
        if (parentType === "group" && group.slug === parentSlug) {
          return { ...group, actions: newActions };
        }
        if (parentType === "child" && group.children) {
          const newChildren = group.children.map((child) => {
            if (child.slug === parentSlug) {
              return { ...child, actions: newActions };
            }
            return child;
          });
          return { ...group, children: newChildren };
        }
        return group;
      })
    );
  };

  const onToggleActionSelected = useCallback(
    (groupSlug: string, actionCode: string, enabled: boolean) => {
      toggleAction(groupSlug, actionCode, enabled);
    },
    [toggleAction]
  );

  const onEditGroup = (updatedGroup: PermissionGroupWithChildren) => {
    setPermissions((prev) =>
      prev.map((grp) => (grp.slug === updatedGroup.slug ? { ...grp, ...updatedGroup } : grp))
    );
  };

  const onEditChild = (parentSlug: string, updatedChild: PermissionChild) => {
    setPermissions((prev) =>
      prev.map((grp) => {
        if (grp.slug === parentSlug) {
          const updatedChildren = grp.children?.map((child) =>
            child.slug === updatedChild.slug ? { ...child, ...updatedChild } : child
          );
          return { ...grp, children: updatedChildren };
        }
        return grp;
      })
    );
  };

  const onRemoveAction = (groupOrChildSlug: string, actionCode: string) => {
    setPermissions((prev) =>
      prev.map((group) => {
        if (group.slug === groupOrChildSlug) {
          return {
            ...group,
            actions: group.actions?.filter((a) => a.code !== actionCode),
          };
        }
        if (group.children) {
          const updatedChildren = group.children.map((child) => {
            if (child.slug === groupOrChildSlug) {
              return {
                ...child,
                actions: child.actions.filter((a) => a.code !== actionCode),
              };
            }
            return child;
          });
          return { ...group, children: updatedChildren };
        }
        return group;
      })
    );

    setSelectedActions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(`${groupOrChildSlug}:${actionCode}`);
      return newSet;
    });

    toast({ title: "Action removed", description: `Action "${actionCode}" removed successfully.` });
  };

  const onRemoveChild = (parentSlug: string, childSlug: string) => {
    setPermissions((prev) =>
      prev.map((group) => {
        if (group.slug === parentSlug) {
          return {
            ...group,
            children: group.children?.filter((child) => child.slug !== childSlug),
          };
        }
        return group;
      })
    );
    toast({ title: "Child removed", description: `Child "${childSlug}" removed successfully.` });
  };

  return (
    <section className="min-h-screen max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-foreground select-none">
        Permission Editor
      </h1>
      <TooltipProvider>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-full overflow-y-auto max-h-[75vh] p-2 border rounded bg-gray-50 dark:bg-gray-800">
            <MenuTable
              permissions={permissions}
              selectedActions={selectedActions}
              onToggleAction={onToggleActionSelected}
              onEditGroup={onEditGroup}
              onEditChild={onEditChild}
              onRemoveAction={onRemoveAction}
              onRemoveChild={onRemoveChild}
              onAddGroup={addPermissionGroup}
              onAddChild={addPermissionChild}
              onAddAction={addActionToGroupOrChild}
              onReorderGroup={reorderGroups}
              onReorderChild={reorderChildren}
              onReorderAction={reorderActions}
              apiResources={apiRoutes}
            />
          </div>
          <div className="md:w-96 flex flex-col gap-6 overflow-y-auto max-h-[75vh] p-4 border rounded bg-gray-50 dark:bg-gray-900">
            <Card className="mb-4 !p-4 bg-amber-50 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="text-center">Load Permissions from YAML</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={yamlInput}
                  onChange={(e) => setYamlInput(e.target.value)}
                  className="w-full h-40 p-2 font-mono text-sm border border-amber-300 rounded resize-none bg-white dark:bg-amber-900 text-amber-950 dark:text-amber-50"
                  placeholder="Paste permissions YAML here..."
                  spellCheck={false}
                />
                <Button onClick={loadPermissionsFromYaml} className="mt-2 w-full" size="sm">
                  Load YAML
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-auto">
              <CardHeader>
                <CardTitle className="text-center">Generated YAML (Selected Permissions)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[50vh] bg-gray-50 p-4 rounded font-mono text-sm whitespace-pre-wrap">
                {yamlInput}
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </section>
  );
};

export default PermissionEditor;
