import React from "react";
import { ApiResource, PermissionNode } from "@/lib/types/allTypes";
import { CreditCard, Zap, Home } from "lucide-react";

export const dummyApiRoutes: ApiResource[] = [
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

export const dummyPermissionData: PermissionNode[] = [
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

export const iconSelectOptions = [
    { label: "CreditCard", value: "CreditCard", icon: React.createElement(CreditCard) },
    { label: "Zap", value: "Zap", icon: React.createElement(Zap) },
    { label: "Home", value: "Home", icon: React.createElement(Home) }
]