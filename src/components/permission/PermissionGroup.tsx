
import { useState } from "react";
import { CreditCard, Zap, Home } from "lucide-react"; // use Zap instead of Lightning
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { PermissionGroup, PermissionChild } from "@/lib/types/allTypes";
import PermissionActionItem from "./PermissionActionItem";

const iconMap = {
  CreditCard: CreditCard,
  Zap: Zap,
  Home: Home,
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

export function PermissionGroupComponent({
  group,
  level = 0,
  onToggleAction,
  selectedActions,
}: PermissionGroupProps) {
  const IconComponent = iconMap[group.icon] ?? CreditCard;
  const [expanded, setExpanded] = useState(level === 0);

  const isChild = "router" in group;

  return (
    <Card className={cn("mb-4 border")}>
      <CardHeader
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5 text-primary-foreground" />
          <CardTitle className="font-semibold text-lg">{group.name}</CardTitle>
          {isChild && (
            <span className="text-sm text-muted-foreground">({group.slug})</span>
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
          {"children" in group && group.children && group.children.length > 0 && (
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

