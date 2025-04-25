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
        name: "SETTINGS",
        id: "settings",
        icon: "CreditCard",
        sequence: 400,
        actions: [
            {
                code: "visible",
                name: "VISIBLE",
                resources: [
                    {
                        method: "POST",
                        path: "/api/v1/attributes"
                    }
                ]
            }
        ],
        children: [
            {
                name: "APP CONFIG",
                id: "app-config",
                icon: "Zap",
                sequence: 410,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "App Config Setup",
                        id: "app-config-setup",
                        icon: "Zap",
                        router: "/system/appconfigs",
                        component: "system/appconfigs/index",
                        sequence: 4101,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/appconfigs/banners"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/appconfigs"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/appconfigs"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/appconfigs/banners/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/appconfigs/banners/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/appconfigs"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "App Localization Setup",
                        id: "app-localization-setup",
                        icon: "Zap",
                        router: "/system/applocalizations",
                        component: "system/applocalizations/index",
                        sequence: 4102,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/applocalizations"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/applocalizations/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/applocalizations/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/applocalizations/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/applocalizations"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "APPSLIDERS",
                id: "app-sliders",
                icon: "Zap",
                sequence: 420,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "App Slider",
                        id: "app-slider",
                        icon: "Zap",
                        router: "/system/appsliders",
                        component: "system/appsliders/index",
                        sequence: 4201,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/appsliders"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/appsliders/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/appsliders/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/appsliders/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/appsliders"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/appsliders/:id"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "NOTIFICATION",
                id: "notification",
                icon: "Zap",
                sequence: 430,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Notification Setup",
                        id: "notification-setup",
                        icon: "CreditCard",
                        router: "/system/notifications",
                        component: "system/notifications/index",
                        sequence: 4301,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/notifications"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/notifications"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/notifications/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/notifications/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/notifications/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/notifications"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/notifications/:id"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "FILES",
                id: "files",
                icon: "CreditCard",
                sequence: 440,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "File",
                        id: "file",
                        icon: "CreditCard",
                        router: "/system/files",
                        component: "system/files/index",
                        sequence: 4401,
                        actions: [
                            {
                                code: "upload",
                                name: "UPLOAD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/files/upload"
                                    }
                                ]
                            },
                            {
                                code: "download-and-upload",
                                name: "DOWNLOAD AND UPLOAD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/files/download-and-upload"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "LOCALIZATION",
                id: "localization",
                icon: "CreditCard",
                sequence: 460,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Language",
                        id: "language",
                        icon: "CreditCard",
                        router: "/system/languages",
                        component: "system/languages/index",
                        sequence: 4601,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/languages"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/languages/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/languages/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/languages/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/languages"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/languages/:id/actions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Country",
                        id: "country",
                        icon: "CreditCard",
                        router: "/system/countries",
                        component: "system/countries/index",
                        sequence: 4602,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/countries"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/countries/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/countries/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/countries/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/countries"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/countries/:id/actions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Currency",
                        id: "currency",
                        icon: "CreditCard",
                        router: "/system/currencies",
                        component: "system/currencies/index",
                        sequence: 4603,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/currencies"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/currencies/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/currencies/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/currencies/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/currencies"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/currencies/:id/actions"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "OFFERS",
                id: "offers",
                icon: "CreditCard",
                sequence: 470,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Promo Codes",
                        id: "promo-codes",
                        icon: "CreditCard",
                        router: "/system/promo-codes",
                        component: "system/promo-codes/index",
                        sequence: 4701,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/promo-codes"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/promo-codes"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/promo-codes/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/promo-codes/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/promo-codes/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/promo-codes"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/promo-codes/:id"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "USERS",
        id: "users",
        icon: "CreditCard",
        sequence: 200,
        actions: [
            {
                code: "visible",
                name: "VISIBLE",
                resources: [
                    {
                        method: "POST",
                        path: "/api/v1/attributes"
                    }
                ]
            }
        ],
        children: [
            {
                name: "USER",
                id: "user",
                icon: "CreditCard",
                sequence: 210,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Admin",
                        id: "admin",
                        icon: "CreditCard",
                        router: "/system/admin",
                        component: "system/admin/index",
                        sequence: 2101,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/roles"
                                    },
                                    {
                                        method: "POST",
                                        path: "/api/v1/users"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/roles"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/users/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/users/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/users/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/users"
                                    }
                                ]
                            },
                            {
                                code: "disable",
                                name: "DISABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/users/:id/disable"
                                    }
                                ]
                            },
                            {
                                code: "enable",
                                name: "ENABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/users/:id/enable"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Customer",
                        id: "customer",
                        icon: "CreditCard",
                        router: "/system/customer",
                        component: "system/customer/index",
                        sequence: 2103,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/customers"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/zodiac-signs"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/countries"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/customers/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/customers/:id"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/zodiac-signs"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/countries"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/customers/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/customers"
                                    }
                                ]
                            },
                            {
                                code: "query-own",
                                name: "QUERY OWN",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/customers",
                                        attribute: "OWN"
                                    }
                                ]
                            },
                            {
                                code: "disable",
                                name: "DISABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/users/:id/disable"
                                    }
                                ]
                            },
                            {
                                code: "enable",
                                name: "ENABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/users/:id/enable"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "ROLES",
                id: "roles",
                icon: "CreditCard",
                sequence: 220,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Menu",
                        id: "menu",
                        icon: "CreditCard",
                        router: "/system/menu",
                        component: "system/menu/index",
                        sequence: 2201,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/menus"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/menus/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/menus/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/menus/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/menus"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/publics/sys/routes"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/menus/:id/actions"
                                    }
                                ]
                            },
                            {
                                code: "disable",
                                name: "DISABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/menus/:id/disable"
                                    }
                                ]
                            },
                            {
                                code: "enable",
                                name: "ENABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/menus/:id/enable"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Role",
                        id: "role",
                        icon: "CreditCard",
                        router: "/system/role",
                        component: "system/role/index",
                        sequence: 2202,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/menus"
                                    },
                                    {
                                        method: "POST",
                                        path: "/api/v1/roles"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/menus"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/roles/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/roles/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/roles/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/roles"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/roles/:id"
                                    }
                                ]
                            },
                            {
                                code: "disable",
                                name: "DISABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/roles/:id/disable"
                                    }
                                ]
                            },
                            {
                                code: "enable",
                                name: "ENABLE",
                                resources: [
                                    {
                                        method: "PATCH",
                                        path: "/api/v1/roles/:id/enable"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "MART",
        id: "mart",
        icon: "CreditCard",
        sequence: 500,
        actions: [
            {
                code: "visible",
                name: "VISIBLE",
                resources: [
                    {
                        method: "POST",
                        path: "/api/v1/attributes"
                    }
                ]
            }
        ],
        children: [
            {
                name: "PRODUCT",
                id: "product",
                icon: "CreditCard",
                sequence: 510,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Product Categories",
                        id: "product-categories",
                        icon: "CreditCard",
                        router: "/system/product-categories",
                        component: "system/product-categories/index",
                        sequence: 5101,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/product-categories"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/product-categories/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/product-categories/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/product-categories/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/product-categories"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/product-categories/:id/actions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Products",
                        id: "products",
                        icon: "CreditCard",
                        router: "/system/products",
                        component: "system/products/index",
                        sequence: 5102,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/products"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/products/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/products/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/products/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/products"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/products/:id/actions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Product Inventory",
                        id: "product-purchases",
                        icon: "CreditCard",
                        router: "/system/product-purchases",
                        component: "system/product-purchases/index",
                        sequence: 5103,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/product-purchases"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/product-purchases/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/product-purchases/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/product-purchases/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/product-purchases"
                                    },
                                    {
                                        method: "GET",
                                        path: "/api/v1/product-purchases/aggregated"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/product-purchases/:id/actions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Product Orders",
                        id: "product-orders",
                        icon: "CreditCard",
                        router: "/system/product-orders",
                        component: "system/product-orders/index",
                        sequence: 5104,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/orders"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/orders/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/orders/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/orders/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/orders"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/orders/:id/actions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Sections",
                        id: "sections",
                        icon: "CreditCard",
                        router: "/system/sections",
                        component: "system/sections/index",
                        sequence: 5105,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/sections"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/sections/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/sections/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/sections/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/sections"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/sections/:id/actions"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "ATTRIBUTE",
                id: "attribute",
                icon: "CreditCard",
                sequence: 520,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Attributes",
                        id: "attributes",
                        icon: "CreditCard",
                        router: "/system/attributes",
                        component: "system/attributes/index",
                        sequence: 5201,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/attributes"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/attributes/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/attributes/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/attributes/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/attributes"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/attributes/:id/actions"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "MART CONFIG",
                id: "mart-config",
                icon: "CreditCard",
                sequence: 530,
                actions: [
                    {
                        code: "visible",
                        name: "VISIBLE",
                        resources: [
                            {
                                method: "POST",
                                path: "/api/v1/attributes"
                            }
                        ]
                    }
                ],
                children: [
                    {
                        name: "Brands",
                        id: "brands",
                        icon: "CreditCard",
                        router: "/system/brands",
                        component: "system/brands/index",
                        sequence: 5301,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/brands"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/brands/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/brands/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/brands/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/brands"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/brands/:id/actions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Tags",
                        id: "tags",
                        icon: "CreditCard",
                        router: "/system/tags",
                        component: "system/tags/index",
                        sequence: 5302,
                        actions: [
                            {
                                code: "add",
                                name: "ADD",
                                resources: [
                                    {
                                        method: "POST",
                                        path: "/api/v1/tags"
                                    }
                                ]
                            },
                            {
                                code: "edit",
                                name: "EDIT",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/tags/:id"
                                    },
                                    {
                                        method: "PUT",
                                        path: "/api/v1/tags/:id"
                                    }
                                ]
                            },
                            {
                                code: "delete",
                                name: "DELETE",
                                resources: [
                                    {
                                        method: "DELETE",
                                        path: "/api/v1/tags/:id"
                                    }
                                ]
                            },
                            {
                                code: "query",
                                name: "QUERY",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/tags"
                                    }
                                ]
                            },
                            {
                                code: "query-actions",
                                name: "QUERY ACTIONS",
                                resources: [
                                    {
                                        method: "GET",
                                        path: "/api/v1/tags/:id/actions"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

// export const dummyPermissionData: PermissionNode[] = [
//     {
//         name: "Users",
//         slug: "users",
//         icon: "CreditCard",
//         sequence: 1,
//         actions: [],
//         children: [
//             {
//                 name: "Admin",
//                 slug: "admin",
//                 icon: "Zap",
//                 router: "/system/admin",
//                 component: "system/admin/index",
//                 sequence: 1,
//                 actions: [
//                     {
//                         code: "add",
//                         name: "Add Roles",
//                         resources: [
//                             { method: "GET", path: "/api/v1/roles" },
//                             { method: "POST", path: "/api/v1/users" },
//                         ],
//                     },
//                     {
//                         code: "edit",
//                         name: "Edit User",
//                         resources: [
//                             { method: "GET", path: "/api/v1/users/:id" },
//                             { method: "PUT", path: "/api/v1/users/:id" },
//                         ],
//                     },
//                     {
//                         code: "delete",
//                         name: "Delete User",
//                         resources: [{ method: "DELETE", path: "/api/v1/users/:id" }],
//                     },
//                 ],
//                 children: [
//                     {
//                         name: "Staff",
//                         slug: "staff",
//                         icon: "Home",
//                         router: "/system/admin/staff",
//                         component: "system/admin/staff/index",
//                         sequence: 1,
//                         actions: [
//                             {
//                                 code: "view",
//                                 name: "View Staff",
//                                 resources: [{ method: "GET", path: "/api/v1/staff" }],
//                             },
//                         ],
//                         children: [],
//                     },
//                 ],
//             },
//         ],
//     },
// ];

export const iconSelectOptions = [
    { label: "CreditCard", value: "CreditCard", icon: React.createElement(CreditCard) },
    { label: "Zap", value: "Zap", icon: React.createElement(Zap) },
    { label: "Home", value: "Home", icon: React.createElement(Home) }
]