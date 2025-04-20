
// Fix PermissionEditor.tsx so PermissionGroupWithChildren type does not define 'router' on group, only on children
// Also fix imports to use proper named imports (TooltipProvider).

import React, { useState, useCallback } from "react";
import { PermissionGroupComponent } from "../components/PermissionGroup";
import { useApiRoutes } from "../hooks/useApiRoutes";
import { toast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TooltipProvider } from "../components/ui/tooltip";

type ApiResource = {
  method: string;
  path: string;
  attribute?: string;
};

type PermissionActionWithResources = {
  code: string;
  name: string;
  resources: ApiResource[];
};

type PermissionChildWithRouter = {
  name: string;
  slug: string;
  icon: "CreditCard" | "LightningCharge" | "Home";
  router: string;
  component: string;
  sequence: number;
  actions: PermissionActionWithResources[];
};

type PermissionGroupWithChildren = {
  name: string;
  slug: string;
  icon: "CreditCard" | "LightningCharge" | "Home";
  sequence: number;
  children?: PermissionChildWithRouter[];
  actions?: PermissionActionWithResources[];
};

const initialData: PermissionGroupWithChildren[] = [
  {
    name: "USERS",
    slug: "users",
    icon: "CreditCard",
    sequence: 200,
    children: [
      {
        name: "Admin",
        slug: "admin",
        icon: "LightningCharge",
        router: "/system/teacher",
        component: "system/teacher/index",
        sequence: 2101,
        actions: [
          {
            code: "add",
            name: "roles",
            resources: [
              { method: "GET", path: "/api/v1/roles" },
              { method: "POST", path: "/api/v1/users" },
            ],
          },
          {
            code: "edit",
            name: "EDIT",
            resources: [
              { method: "GET", path: "/api/v1/roles" },
              { method: "GET", path: "/api/v1/users/:id" },
              { method: "PUT", path: "/api/v1/users/:id" },
            ],
          },
          {
            code: "delete",
            name: "DELETE",
            resources: [{ method: "DELETE", path: "/api/v1/users/:id" }],
          },
          {
            code: "query",
            name: "QUERY",
            resources: [{ method: "GET", path: "/api/v1/users" }],
          },
          {
            code: "disable",
            name: "DISABLE",
            resources: [{ method: "PATCH", path: "/api/v1/users/:id/disable" }],
          },
          {
            code: "enable",
            name: "ENABLE",
            resources: [{ method: "PATCH", path: "/api/v1/users/:id/enable" }],
          },
        ],
      },
      {
        name: "Teacher",
        slug: "teacher",
        icon: "LightningCharge",
        router: "/system/teacher",
        component: "system/teacher/index",
        sequence: 2102,
        actions: [
          {
            code: "add",
            name: "ADD",
            resources: [{ method: "POST", path: "/api/v1/teachers" }],
          },
          {
            code: "edit",
            name: "EDIT",
            resources: [
              { method: "GET", path: "/api/v1/teachers/:id" },
              { method: "PUT", path: "/api/v1/teachers/:id" },
            ],
          },
          {
            code: "delete",
            name: "DELETE",
            resources: [{ method: "DELETE", path: "/api/v1/teachers/:id" }],
          },
          {
            code: "query",
            name: "QUERY",
            resources: [{ method: "GET", path: "/api/v1/teachers" }],
          },
          {
            code: "disable",
            name: "DISABLE",
            resources: [{ method: "PATCH", path: "/api/v1/users/:id/disable" }],
          },
          {
            code: "enable",
            name: "ENABLE",
            resources: [{ method: "PATCH", path: "/api/v1/users/:id/enable" }],
          },
        ],
      },
      {
        name: "Student",
        slug: "student",
        icon: "CreditCard",
        router: "/system/student",
        component: "system/student/index",
        sequence: 2103,
        actions: [
          {
            code: "add",
            name: "ADD",
            resources: [
              { method: "POST", path: "/api/v1/students" },
              { method: "GET", path: "/api/v1/zodiac-signs" },
              { method: "GET", path: "/api/v1/countries" },
            ],
          },
          {
            code: "edit",
            name: "EDIT",
            resources: [
              { method: "GET", path: "/api/v1/students/:id" },
              { method: "PUT", path: "/api/v1/students/:id" },
              { method: "GET", path: "/api/v1/zodiac-signs" },
              { method: "GET", path: "/api/v1/countries" },
            ],
          },
          {
            code: "delete",
            name: "DELETE",
            resources: [{ method: "DELETE", path: "/api/v1/students/:id" }],
          },
          {
            code: "query",
            name: "QUERY",
            resources: [{ method: "GET", path: "/api/v1/students" }],
          },
          {
            code: "query-own",
            name: "QUERY OWN",
            resources: [
              { method: "GET", path: "/api/v1/students", attribute: "OWN" },
            ],
          },
          {
            code: "disable",
            name: "DISABLE",
            resources: [{ method: "PATCH", path: "/api/v1/users/:id/disable" }],
          },
          {
            code: "enable",
            name: "ENABLE",
            resources: [{ method: "PATCH", path: "/api/v1/users/:id/enable" }],
          },
        ],
      },
    ],
  },
];

const PermissionEditor = () => {
  const { data: apiRoutes, isLoading, error } = useApiRoutes();

  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  const [permissions, setPermissions] =
    useState<PermissionGroupWithChildren[]>(initialData);

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
        description: `Action "${actionCode}" for "${groupSlug}" ${
          enabled ? "enabled" : "disabled"
        }`,
      });
    },
    []
  );

  function generateYaml(permGroups: PermissionGroupWithChildren[]) {
    function yamlString(value: any, indent = 0): string {
      const space = "  ".repeat(indent);
      if (typeof value === "string") {
        if (value.includes("\n")) {
          return `|-\n${"  ".repeat(indent + 1)}${value.replace(
            /\n/g,
            "\n" + "  ".repeat(indent + 1)
          )}`;
        } else {
          return `"${value}"`;
        }
      }
      if (Array.isArray(value)) {
        return (
          "\n" +
          value
            .map((v) => `${space}- ${yamlString(v, indent + 1).trimStart()}`)
            .join("\n")
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

    function filterActions(
      actions: PermissionActionWithResources[],
      slug: string
    ) {
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

    const filtered = permGroups
      .map((g) => processGroup(g))
      .filter((g) => g.actions || g.children);

    let yaml = yamlString(filtered);
    yaml = yaml.replace(/"([^"]+)"/g, "$1");

    return `- ${yaml.trimStart()}`;
  }

  return (
    <section className="min-h-screen max-w-6xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-foreground">
        Permission Editor
      </h1>
      <TooltipProvider>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 overflow-y-auto max-h-[70vh]">
            {permissions.map((grp) => (
              <PermissionGroupComponent
                key={grp.slug}
                group={grp}
                onToggleAction={toggleAction}
                selectedActions={selectedActions}
              />
            ))}
          </div>
          <div className="md:w-1/2">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Available API Routes</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[200px] overflow-y-auto text-sm font-mono bg-gray-50 p-2 rounded">
                {isLoading && <p>Loading API routes...</p>}
                {error && <p className="text-destructive">{error.message}</p>}
                {!isLoading && apiRoutes && apiRoutes.length > 0 ? (
                  <ul>
                    {apiRoutes.map(({ method, path }) => (
                      <li key={`${method}-${path}`} className="mb-0.5">
                        <code>
                          <span className="font-semibold">{method}</span> {path}
                        </code>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !isLoading && <p>No routes available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated YAML (Selected Permissions)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[50vh] bg-gray-50 p-2 rounded whitespace-pre-wrap font-mono text-sm">
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

