
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Checkbox } from "./ui/checkbox";
import { CreditCard, Zap, Home } from "lucide-react";

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
  icon: "CreditCard" | "Zap" | "Home";
  router: string;
  component: string;
  sequence: number;
  actions: PermissionAction[];
};

export type PermissionGroup = {
  name: string;
  slug: string;
  icon: "CreditCard" | "Zap" | "Home";
  sequence: number;
  actions?: PermissionAction[];
  children?: PermissionChild[];
};

const iconMap = {
  CreditCard: CreditCard,
  Zap: Zap,
  Home: Home,
};

type MenuTableProps = {
  permissions: PermissionGroup[];
  selectedActions: Set<string>;
  onToggleAction: (groupSlug: string, actionCode: string, enabled: boolean) => void;
  onEditGroup: (updatedGroup: PermissionGroup) => void;
  onEditChild: (parentSlug: string, updatedChild: PermissionChild) => void;
  onRemoveAction: (groupSlug: string, actionCode: string) => void;
  onRemoveChild: (parentSlug: string, childSlug: string) => void;
};

function EditableCell({
  value,
  onChange,
  type = "text",
  className = "",
}: {
  value: string;
  onChange: (newVal: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      className={`text-sm p-1 ${className}`}
    />
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
}: MenuTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroupExpanded = (slug: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  const IconComponent = ({ icon }: { icon: "CreditCard" | "Zap" | "Home" }) => {
    const Icon = iconMap[icon] || CreditCard;
    return <Icon className="inline-block h-5 w-5 mr-1 text-primary-foreground" />;
  };

  const updateGroupField = (group: PermissionGroup, field: keyof PermissionGroup, val: string) => {
    const updated = { ...group, [field]: val };
    onEditGroup(updated);
  };

  const updateChildField = (parentSlug: string, child: PermissionChild, field: keyof PermissionChild, val: string) => {
    const updated = { ...child, [field]: val };
    onEditChild(parentSlug, updated);
  };

  const handleRemoveChild = (parentSlug: string, childSlug: string) => {
    onRemoveChild(parentSlug, childSlug);
  };

  const handleRemoveAction = (groupSlug: string, actionCode: string) => {
    onRemoveAction(groupSlug, actionCode);
  };

  const ActionRow = ({
    action,
    groupSlug,
    canEdit = true,
  }: {
    action: PermissionAction;
    groupSlug: string;
    canEdit?: boolean;
  }) => {
    const isChecked = selectedActions.has(`${groupSlug}:${action.code}`);

    return (
      <TableRow>
        <TableCell className="pl-12">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => onToggleAction(groupSlug, action.code, Boolean(checked))}
            id={`${groupSlug}-action-${action.code}`}
          />
        </TableCell>
        <TableCell>
          <label htmlFor={`${groupSlug}-action-${action.code}`} className="cursor-pointer select-none">
            {action.code}
          </label>
        </TableCell>
        <TableCell>{action.name}</TableCell>
        <TableCell>
          {action.resources.length}
          {action.resources.length === 1 ? " resource" : " resources"}
        </TableCell>
        <TableCell>
          {canEdit && (
            <Button size="sm" variant="destructive" onClick={() => handleRemoveAction(groupSlug, action.code)}>
              Remove
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "40px" }} />
            <TableHead style={{ width: "150px" }}>Code</TableHead>
            <TableHead style={{ width: "250px" }}>Action Name</TableHead>
            <TableHead style={{ width: "150px" }}>Associated Resources</TableHead>
            <TableHead style={{ width: "90px" }}>Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((group) => (
            <React.Fragment key={group.slug}>
              <TableRow
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => toggleGroupExpanded(group.slug)}
              >
                <TableCell colSpan={5} className="font-semibold flex items-center space-x-2">
                  <button
                    aria-label={expandedGroups.has(group.slug) ? "Collapse group" : "Expand group"}
                    className="text-lg font-bold w-6 h-6 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroupExpanded(group.slug);
                    }}
                  >
                    {expandedGroups.has(group.slug) ? "−" : "+"}
                  </button>
                  <IconComponent icon={group.icon} />
                  <EditableCell
                    value={group.name}
                    onChange={(val) => updateGroupField(group, "name", val)}
                  />
                  <span className="text-sm text-gray-500 select-text w-40 truncate">{group.slug}</span>
                </TableCell>
              </TableRow>

              {expandedGroups.has(group.slug) && (
                <>
                  {group.actions && group.actions.length > 0 && (
                    <>
                      {group.actions.map((action) => (
                        <ActionRow key={`group-action-${action.code}`} action={action} groupSlug={group.slug} />
                      ))}
                    </>
                  )}

                  {group.children && group.children.length > 0 && (
                    <>
                      {group.children.map((child) => (
                        <React.Fragment key={child.slug}>
                          <TableRow className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600" onClick={(e) => e.stopPropagation()}>
                            <TableCell className="pl-8 flex items-center space-x-2" colSpan={5}>
                              <IconComponent icon={child.icon} />
                              <EditableCell
                                value={child.name}
                                onChange={(val) => updateChildField(group.slug, child, "name", val)}
                              />
                              <span className="text-sm text-gray-500 select-text w-32 truncate">{child.slug}</span>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="ml-auto"
                                onClick={() => handleRemoveChild(group.slug, child.slug)}
                                title="Remove child"
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>

                          {child.actions && child.actions.length > 0 && (
                            <>
                              {child.actions.map((action) => (
                                <ActionRow
                                  key={`child-action-${action.code}`}
                                  action={action}
                                  groupSlug={child.slug}
                                />
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
          {permissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No menus/permissions available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
