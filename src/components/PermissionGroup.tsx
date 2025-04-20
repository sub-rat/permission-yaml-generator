
import React, { useState } from "react";
import { CreditCard, Lightning, HouseLine } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Checkbox,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

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
  icon: "CreditCard" | "Lightning" | "HouseLine";
  router: string;
  component: string;
  sequence: number;
  actions: PermissionAction[];
};

export type PermissionGroup = {
  name: string;
  slug: string;
  icon: "CreditCard" | "Lightning" | "HouseLine";
  sequence: number;
  actions?: PermissionAction[];
  children?: PermissionChild[];
};

const iconMap = {
  CreditCard: CreditCard,
  Lightning: Lightning,
  HouseLine: HouseLine,
};

interface PermissionGroupProps {
  group: PermissionGroup | PermissionChild;
  level?: number;
  onToggleAction?: (
    groupSlug: string,
    actionCode: string,
    enabled: boolean
  ) => void;
  selectedActions?: Set<string>;
}

function PermissionActionItem({
  action,
  groupSlug,
  onToggle,
  selectedActions,
}: {
  action: PermissionAction;
  groupSlug: string;
  onToggle?: (
    groupSlug: string,
    actionCode: string,
    enabled: boolean
  ) => void;
  selectedActions?: Set<string>;
}) {
  const isChecked = selectedActions?.has(`${groupSlug}:${action.code}`);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Checkbox
            id={`${groupSlug}-action-${action.code}`}
            checked={isChecked}
            onCheckedChange={(checked) =>
              onToggle?.(groupSlug, action.code, Boolean(checked))
            }
          />
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{action.name}</p>
          <p className="text-xs text-muted-foreground">
            {action.resources.length} resource
            {action.resources.length !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
      <label
        htmlFor={`${groupSlug}-action-${action.code}`}
        className="ml-2 select-none cursor-pointer"
      >
        {action.code}
      </label>
    </TooltipProvider>
  );
}

export function PermissionGroupComponent({
  group,
  level = 0,
  onToggleAction,
  selectedActions,
}: PermissionGroupProps) {
  const IconComponent = iconMap[group.icon] ?? CreditCard;
  const [expanded, setExpanded] = useState(level === 0);

  const isChild = "router" in group; // distinguish child from root group

  return (
    <Card className={cn("mb-4 border")}>
      <CardHeader
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5 text-primary-foreground" />
          <CardTitle className="font-semibold text-lg">
            {group.name}
          </CardTitle>
          {isChild && (
            <span className="text-sm text-muted-foreground">
              ({group.slug})
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-label={expanded ? "Collapse" : "Expand"}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? "−" : "+"}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent>
          {group.actions && group.actions.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 font-medium">Actions</p>
              <div className="space-y-1">
                {group.actions.map((action) => (
                  <PermissionActionItem
                    key={action.code}
                    action={action}
                    groupSlug={group.slug}
                    onToggle={onToggleAction}
                    selectedActions={selectedActions}
                  />
                ))}
              </div>
            </div>
          )}
          {"children" in group &&
            group.children &&
            group.children.length > 0 && (
              <div className="ml-6">
                {group.children.map((child) => (
                  <PermissionGroupComponent
                    key={child.slug}
                    group={child}
                    level={level + 1}
                    onToggleAction={onToggleAction}
                    selectedActions={selectedActions}
                  />
                ))}
              </div>
            )}
        </CardContent>
      )}
    </Card>
  );
}
