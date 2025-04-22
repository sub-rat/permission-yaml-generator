import React, { useState, useEffect, useCallback } from "react";
import yaml from "js-yaml";
import { toast } from "../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TooltipProvider } from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import { MenuTable, PermissionNode, ApiResource, PermissionAction } from "../components/MenuTable";

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

const dummyPermissionData: PermissionNode[] = [
  {
    name: "Users",
    slug: "users",
    icon: "CreditCard",
    sequence: 1,
    actions: [],
    children: [
      {
        name: "Admin",
        slug: "admin",
        icon: "Zap",
        router: "/system/admin",
        component: "system/admin/index",
        sequence: 1,
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
        children: [
          {
            name: "Staff",
            slug: "staff",
            icon: "Home",
            router: "/system/admin/staff",
            component: "system/admin/staff/index",
            sequence: 1,
            actions: [
              {
                code: "view",
                name: "View Staff",
                resources: [{ method: "GET", path: "/api/v1/staff" }],
              },
            ],
            children: [],
          },
        ],
      },
    ],
  },
];

const PermissionEditor = () => {
  const [apiResources, setApiResources] = useState<ApiResource[]>([]);
  const [permissions, setPermissions] = useState<PermissionNode[]>([]);

  useEffect(() => {
    const fetchApiResources = async () => {
      await new Promise((res) => setTimeout(res, 300));
      setApiResources(dummyApiRoutes);
    };
    fetchApiResources();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      await new Promise((res) => setTimeout(res, 300));
      setPermissions(dummyPermissionData);
    };
    fetchPermissions();
  }, []);

  const onAddGroup = (group: Partial<PermissionNode>) => {
    if (!group.name || !group.slug) {
      toast({ title: "Validation error", description: "Group name and slug required." });
      return;
    }
    if (permissions.find((g) => g.slug === group.slug)) {
      toast({ title: "Validation error", description: "Group slug already exists." });
      return;
    }
    const newGroup: PermissionNode = {
      name: group.name,
      slug: group.slug,
      icon: group.icon || "CreditCard",
      sequence: permissions.length + 1,
      actions: [],
      children: [],
    };
    setPermissions((prev) => [...prev, newGroup]);
    toast({ title: "Group added", description: `"${group.name}" was added.` });
  };

  const addChildToNode = (
    nodes: PermissionNode[],
    parentSlug: string,
    child: Partial<PermissionNode>
  ): PermissionNode[] => {
    return nodes.map((node) => {
      if (node.slug === parentSlug) {
        if (node.children?.find((c) => c.slug === child.slug)) {
          toast({ title: "Validation error", description: "Child slug already exists." });
          return node;
        }
        const newChild: PermissionNode = {
          name: child.name!,
          slug: child.slug!,
          icon: child.icon || "CreditCard",
          router: child.router,
          component: child.component,
          sequence: (node.children?.length ?? 0) + 1,
          actions: [],
          children: [],
        };
        return {
          ...node,
          children: [...(node.children ?? []), newChild],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addChildToNode(node.children, parentSlug, child),
        };
      }
      return node;
    });
  };

  const onAddChild = (parentSlug: string, child: Partial<PermissionNode>) => {
    if (!parentSlug || !child.name || !child.slug) {
      toast({ title: "Validation error", description: "Child name and slug required." });
      return;
    }
    setPermissions((prev) => addChildToNode(prev, parentSlug, child));
    toast({ title: "Child added", description: `Child "${child.name}" added successfully.` });
  };

  const addActionToNode = (
    nodes: PermissionNode[],
    targetSlug: string,
    action: PermissionAction
  ): PermissionNode[] => {
    return nodes.map((node) => {
      if (node.slug === targetSlug) {
        if (node.actions.find((a) => a.code === action.code)) {
          toast({ title: "Validation error", description: "Action code already exists." });
          return node;
        }
        return {
          ...node,
          actions: [...node.actions, action],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addActionToNode(node.children, targetSlug, action),
        };
      }
      return node;
    });
  };

  const onAddAction = (targetSlug: string, action: PermissionAction) => {
    if (!action.code || !action.name || action.resources.length === 0) {
      toast({ title: "Validation error", description: "Action code, name, and resources required." });
      return;
    }
    setPermissions((prev) => addActionToNode(prev, targetSlug, action));
    toast({ title: "Action added", description: `Action "${action.code}" added successfully.` });
  };

  const removeActionFromNode = (
    nodes: PermissionNode[],
    nodeSlug: string,
    actionCode: string
  ): PermissionNode[] => {
    return nodes.map((node) => {
      if (node.slug === nodeSlug) {
        return {
          ...node,
          actions: node.actions.filter((a) => a.code !== actionCode),
        };
      }
      if (node.children) {
        return {
          ...node,
          children: removeActionFromNode(node.children, nodeSlug, actionCode),
        };
      }
      return node;
    });
  };

  const onRemoveAction = (nodeSlug: string, actionCode: string) => {
    setPermissions((prev) => removeActionFromNode(prev, nodeSlug, actionCode));
    toast({ title: "Action removed", description: `Action "${actionCode}" removed successfully.` });
  };

  const removeChildFromNode = (
    nodes: PermissionNode[],
    parentSlug: string,
    childSlug: string
  ): PermissionNode[] => {
    return nodes.map((node) => {
      if (node.slug === parentSlug) {
        return {
          ...node,
          children: node.children?.filter((c) => c.slug !== childSlug),
        };
      }
      if (node.children) {
        return {
          ...node,
          children: removeChildFromNode(node.children, parentSlug, childSlug),
        };
      }
      return node;
    });
  };

  const onRemoveChild = (parentSlug: string, childSlug: string) => {
    setPermissions((prev) => removeChildFromNode(prev, parentSlug, childSlug));
    toast({ title: "Child removed", description: `Child "${childSlug}" removed successfully.` });
  };

  const editNode = (
    nodes: PermissionNode[],
    updatedNode: PermissionNode
  ): PermissionNode[] => {
    return nodes.map((node) => {
      if (node.slug === updatedNode.slug) {
        return {
          ...updatedNode,
          children: updatedNode.children
            ? editNode(node.children || [], updatedNode)
            : node.children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: editNode(node.children, updatedNode),
        };
      }
      return node;
    });
  };

  const onEditNode = (updatedNode: PermissionNode) => {
    setPermissions((prev) => editNode(prev, updatedNode));
    toast({ title: "Node updated", description: `Node "${updatedNode.name}" updated successfully.` });
  };

  return (
    <section className="min-h-screen max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-foreground select-none">
        Permission Editor
      </h1>
      <TooltipProvider>
        <MenuTable
          permissions={permissions}
          selectedActions={new Set()}
          onAddGroup={onAddGroup}
          onAddChild={onAddChild}
          onAddAction={onAddAction}
          onRemoveAction={onRemoveAction}
          onRemoveChild={onRemoveChild}
          onEditNode={onEditNode}
          onReorderGroup={() => {}}
          onReorderChild={() => {}}
          onReorderAction={() => {}}
          apiResources={apiResources}
        />
      </TooltipProvider>
    </section>
  );
};

export default PermissionEditor;
