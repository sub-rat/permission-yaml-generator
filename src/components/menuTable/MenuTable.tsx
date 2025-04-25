
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger
} from "../ui/dialog";
import { MenuTableProps } from "@/lib/types/allTypes";
import AddGroupDialog from "./AddGroupDialog";
import PermissionNodeItem from "../permission/PermissionNodeItem";


export function MenuTable({
  permissions,
  selectedActions,
  onAddGroup,
  onAddChild,
  onAddAction,
  onRemoveAction,
  onRemoveChild,
  onEditNode,
  onReorderGroup,
  onReorderChild,
  onReorderAction,
  apiResources,
}: MenuTableProps) {
  const [addGroupOpen, setAddGroupOpen] = React.useState(false);

  return (
    <div className="flex w-full flex-col rounded border bg-white shadow-sm p-2 overflow-auto max-h-[75vh]">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Permission Groups</h2>
        <Dialog open={addGroupOpen} onOpenChange={(open: boolean) => setAddGroupOpen(open)}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Group</span>
            </Button>
          </DialogTrigger>
          {addGroupOpen && (
            <AddGroupDialog
              onAdd={onAddGroup}
              onClose={() => setAddGroupOpen(false)}
            />
          )}
        </Dialog>
      </div>
      {permissions?.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No permission groups available.
        </p>
      ) : (
        <div className="space-y-2">
          {permissions
            .slice()
            .sort((a, b) => a.sequence - b.sequence)
            .map((group, index) => (
              <PermissionNodeItem
                key={index}
                node={group}
                selectedActions={selectedActions}
                onAddChild={onAddChild}
                onAddAction={onAddAction}
                onRemoveAction={onRemoveAction}
                onRemoveChild={onRemoveChild}
                onEditNode={onEditNode}
                apiResources={apiResources}
              />
            ))}
        </div>
      )}
    </div>
  );
}
