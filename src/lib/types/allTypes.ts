export type ApiResource = {
  method: string;
  path: string;
  attribute?: string;
};

export type PermissionAction = {
  code: string;
  name: string;
  resources?: ApiResource[];
};

export type PermissionNode = {
  name: string;
  slug?: string;
  id?: string;
  icon: "CreditCard" | "Zap" | "Home" | string; // todo: increase icons and remove string field ?
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

export type PermissionChild = {
  name: string;
  slug: string;
  icon: "CreditCard" | "Zap" | "Home" | string;
  router: string;
  component: string;
  sequence: number;
  actions: PermissionAction[];
};

export type PermissionGroup = {
  name: string;
  slug: string;
  icon: "CreditCard" | "Zap" | "Home" | string;
  sequence: number;
  actions?: PermissionAction[];
  children?: PermissionChild[];
};


