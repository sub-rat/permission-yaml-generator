import React from "react";
import { Button } from "../ui/button";
import { CreditCard, Zap, Home, Plus, Edit } from "lucide-react";
import {
    Dialog,
} from "../ui/dialog";
import { ApiResource, PermissionAction, PermissionNode } from "@/lib/types/allTypes";
import EditGroupDialog from "../menuTable/EditGroupDialog";
import AddChildDialog from "../menuTable/AddChildDialog";
import EditActionDialog from "../menuTable/EditActionDialog";
import AddActionDialog from "../menuTable/AddActionDialog";

function PermissionNodeItem({
    node,
    level = 0,
    selectedActions,
    onAddChild,
    onAddAction,
    onRemoveAction,
    onRemoveChild,
    onEditNode,
    apiResources,
}: {
    node: PermissionNode;
    level?: number;
    selectedActions: Set<string>;
    onAddChild: (parentSlug: string, child: Partial<PermissionNode>) => void;
    onAddAction: (targetSlug: string, action: PermissionAction) => void;
    onRemoveAction: (nodeSlug: string, actionCode: string) => void;
    onRemoveChild: (parentSlug: string, childSlug: string) => void;
    onEditNode: (updatedNode: PermissionNode) => void;
    apiResources: ApiResource[];
}) {
    const [expanded, setExpanded] = React.useState(false);
    const [addChildOpen, setAddChildOpen] = React.useState(false);
    const [addActionOpen, setAddActionOpen] = React.useState(false);
    const [editNodeOpen, setEditNodeOpen] = React.useState(false);
    const [editActionOpenCode, setEditActionOpenCode] = React.useState<string | null>(null);

    const IconMap = {
        CreditCard: CreditCard,
        Zap: Zap,
        Home: Home,
    };
    const IconComponent = IconMap[node.icon] || CreditCard;

    const openEditActionDialog = (code: string) => {
        setEditActionOpenCode(code);
    };

    const closeEditActionDialog = () => {
        setEditActionOpenCode(null);
    };

    const handleEditNodeSave = (updatedNode: PermissionNode) => {
        onEditNode(updatedNode);
    };

    const handleEditActionSave = (updatedAction: PermissionAction) => {
        // Update action in the node
        const updatedActions = node.actions.map((act) =>
            act.code === updatedAction.code ? updatedAction : act
        );
        onEditNode({ ...node, actions: updatedActions });
        closeEditActionDialog();
    };

    return (
        <div className="mb-4 border rounded bg-white shadow-sm" style={{ marginLeft: level * 16 }}>
            <div className="flex items-center justify-between p-2 cursor-pointer select-none" onClick={() => setExpanded((v) => !v)}>
                <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-primary-foreground" />
                    <span className="font-semibold">{node.name}</span>
                    <span className="text-xs text-muted-foreground">({node.slug})</span>
                    {node.router && <span className="ml-2 text-sm font-mono text-gray-400">{node.router}</span>}
                </div>
                
                <div className="flex space-x-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAddChildOpen(true);
                        }}
                    >
                        <Plus size={14} />
                        <span className="ml-1">Add Child</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAddActionOpen(true);
                        }}
                    >
                        <Plus size={14} />
                        <span className="ml-1">Add Action</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditNodeOpen(true);
                        }}
                        aria-label={`Edit node ${node.name}`}
                        title={`Edit node ${node.name}`}
                    >
                        <Edit size={16} />
                    </Button>
                </div>
            </div>
            
            {expanded && (
                <div className="p-2 space-y-2">
                    {node.actions && node.actions?.length > 0 && (
                        <div>
                            <p className="mb-1 font-medium">Actions:</p>
                            <ul className="space-y-1">
                                {node.actions.map((action) => (
                                    <li
                                        key={action.code}
                                        className="flex items-center justify-between border rounded p-1"
                                    >
                                        <div>
                                            <span className="font-semibold mr-2">{action.code}</span>
                                            <span className="text-sm text-muted-foreground">{action.name}</span>
                                            <span className="text-xs text-muted-foreground ml-2">({action.resources?.length} resource{action.resources?.length !== 1 ? "s" : ""})</span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openEditActionDialog(action.code)}
                                                aria-label={`Edit action ${action.code}`}
                                                title={`Edit action ${action.code}`}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onRemoveAction(node.slug, action.code)}
                                                aria-label={`Remove action ${action.code}`}
                                            >
                                                &times;
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {node.children && node.children?.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {node.children
                                .slice()
                                .sort((a, b) => a.sequence - b.sequence)
                                .map((child, index) => (
                                    <PermissionNodeItem
                                        key={index}
                                        node={child}
                                        level={level + 1}
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
            )}
            <Dialog open={addChildOpen} onOpenChange={setAddChildOpen}>
                <AddChildDialog
                    parentSlug={node.slug}
                    onAdd={onAddChild}
                    onClose={() => setAddChildOpen(false)}
                />
            </Dialog>
            <Dialog open={addActionOpen} onOpenChange={setAddActionOpen}>
                <AddActionDialog
                    targetSlug={node.slug}
                    onAdd={onAddAction}
                    onClose={() => setAddActionOpen(false)}
                    apiResources={apiResources}
                />
            </Dialog>
            <Dialog open={editNodeOpen} onOpenChange={setEditNodeOpen}>
                <EditGroupDialog
                    group={node}
                    onSave={handleEditNodeSave}
                    onClose={() => setEditNodeOpen(false)}
                />
            </Dialog>
            {editActionOpenCode && (
                <Dialog open onOpenChange={(open) => {
                    if (!open) closeEditActionDialog();
                }}>
                    <EditActionDialog
                        targetSlug={node.slug}
                        action={node.actions.find(a => a.code === editActionOpenCode)!}
                        onSave={handleEditActionSave}
                        onClose={closeEditActionDialog}
                        apiResources={apiResources}
                    />
                </Dialog>
            )}
        </div>
    );
}

export default PermissionNodeItem