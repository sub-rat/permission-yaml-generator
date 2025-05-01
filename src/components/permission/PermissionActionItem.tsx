import { Checkbox } from "../ui/checkbox";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { PermissionAction } from "@/lib/types/allTypes";

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

export default PermissionActionItem