
import { useState, useEffect, useRef } from "react";
import yaml from "js-yaml";
import { toast } from "../hooks/use-toast";
import {
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  Button
} from "@/components/ui/button";
import {
  MenuTable
} from "@/components/menuTable/MenuTable"
import {
  PermissionNode,
  ApiResource,
  PermissionAction
} from '@/lib/types/allTypes'
import { dummyPermissionData } from "@/lib/data/data";
import { getRoutes } from "@/lib/api/routes";
import { useNavigate } from "react-router-dom";
import { messages } from "@/lib/constants/messages";
import { Input } from "@/components/ui/input";
import { handleFileChange } from "@/lib/utils/fileReader";
import DownloadYaml from "@/components/editor/DownloadYaml";
import { findIndexOfCurrentWord } from "@/lib/utils/editor";

const PermissionEditor = () => {
  const navigate = useNavigate()

  // const [editorMode, setEditorMode] = useState<'view' | 'edit'>('edit')
  const [apiResources, setApiResources] = useState<ApiResource[]>([])
  const [permissions, setPermissions] = useState<PermissionNode[]>([])
  const [yamlInput, setYamlInput] = useState<string>("")
  const [matchingWords, setMatchingWords] = useState<string[]>([])
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    visible: true,
    visibilityChangeReason: 'scroll'
  })
  const [suggestionsList, setSuggestionsList] = useState<string[]>([])
  const [selectedSuggestionsIndex, setSelectedOptionsIndex] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchApiResources = async () => {
      await new Promise((res) => setTimeout(res, 250))
      const resourcesDataRes = await getRoutes()

      if (resourcesDataRes.message == messages.MALFORMED_AUTH) navigate("/");

      // setApiResources(dummyApiRoutes);
      setApiResources(resourcesDataRes.data)

      const paths = resourcesDataRes.data.map(item => item.path)
      setSuggestionsList(paths)
    };
    fetchApiResources();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      await new Promise((res) => setTimeout(res, 300));
      setPermissions(dummyPermissionData);
      setYamlInput(yaml.dump(dummyPermissionData));
    };
    fetchPermissions();
  }, []);

  // Auto-update YAML output when permissions change
  useEffect(() => {
    try {
      const newYaml = yaml.dump(permissions);
      setYamlInput(newYaml);
    } catch (e) {
      // Ignore YAML serialization errors
    }
  }, [permissions]);

  // Load permissions from YAML input textarea
  const onYamlLoad = () => {
    try {
      const parsed = yaml.load(yamlInput);
      if (!Array.isArray(parsed)) {
        toast({ title: "Invalid YAML", description: "The YAML should represent an array of permission nodes." });
        return;
      }

      // Validate minimum required properties present?
      setPermissions(parsed as PermissionNode[]);
      toast({ title: "YAML Loaded", description: "Permissions loaded from YAML successfully." });
    } catch (e) {
      toast({ title: "Error parsing YAML", description: String(e) });
    }
  };

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

  const handleFile = async (e) => {
    const yamlConvert = handleFileChange(e)
    const yamlText = await yamlConvert

    if (yamlText) {
      const parsed = yaml.load(yamlText)
      if (!Array.isArray(parsed)) {
        toast({ title: "Invalid YAML", description: "The YAML should represent an array of permission nodes." });
        return;
      }

      setPermissions(parsed as PermissionNode[])
      setYamlInput(yamlText)
    }
  }

  const replaceCurrentWord = (newWord: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentValue = yamlInput;
    const cursorPos = textarea.selectionStart;
    const startIndex = findIndexOfCurrentWord(textarea);

    const newValue =
      currentValue.substring(0, startIndex + 1) +
      newWord +
      currentValue.substring(cursorPos);

    setYamlInput(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorPos = startIndex + 1 + newWord.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });

    setDropdownPosition((prev) => ({
      ...prev,
      visible: false,
      visibilityChangeReason: 'replaceWord'
    }));

    setSelectedOptionsIndex(0)
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;

    const cursorPos = textarea.selectionStart;
    const textUntilCursor = textarea.value.substring(0, cursorPos);

    const words = textUntilCursor.trim().split(/\s+/);
    const currentWord = words[words.length - 1] || '';
    const previousWord = words.length >= 2 ? words[words.length - 2] : '';

    if (previousWord !== "path:" || currentWord == "") {
      setMatchingWords([]);
      return;
    }
  }

  const handleInput = () => {
    const textarea = textareaRef.current;
    const mirror = mirrorRef.current;

    if (dropdownPosition.visibilityChangeReason != 'escape') {
      setDropdownPosition(prev => ({
        ...prev,
        visible: true,
      }));
    }

    if (!textarea || !mirror || !dropdownPosition.visible) return;

    const cursorPos = textarea.selectionStart;
    const textUntilCursor = textarea.value.substring(0, cursorPos);

    const words = textUntilCursor.trim().split(/\s+/);
    const currentWord = words[words.length - 1] || '';
    const previousWord = words.length >= 2 ? words[words.length - 2] : '';

    if (previousWord !== "path:" || currentWord == "") {
      setMatchingWords([]);
      return;
    }

    const filtered = suggestionsList.filter((s) => s.includes(currentWord));
    setMatchingWords(filtered);

    mirror.innerText = textUntilCursor.replace(/\n$/, '\n.');
    const span = document.createElement('span');
    span.textContent = '.';
    mirror.appendChild(span);

    const { offsetTop, offsetLeft } = span;

    setDropdownPosition({
      top: offsetTop + 20,
      left: offsetLeft,
      visible: true,
      visibilityChangeReason: 'scroll'
    });

    mirror.removeChild(span);
  };

  return (
    <div className="p-4 min-h-screen w-screen bg-slate-800">
      <section className="min-h-screen max-w-7xl mx-auto p-6 bg-white  border rounded-md shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700 select-none">
          Permission Editor
        </h1>

        <div className="mb-4">
          <div className="relative">
            <textarea
              id="yaml-input"
              ref={textareaRef}
              rows={20}
              className="w-full rounded border border-gray-300 p-2 font-mono text-sm"
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
              onKeyDown={(e) => {
                const selectedOptionsLimit = matchingWords.length >= 10 ? 9 : matchingWords.length - 1

                if (e.key == "Escape") {
                  setDropdownPosition(prev => ({
                    ...prev,
                    visible: !prev.visible,
                    visibilityChangeReason: 'escape'
                  }))
                }
                else if (dropdownPosition.visible) {
                  if (e.key == "ArrowDown") {
                    e.stopPropagation()
                    e.preventDefault()

                    if (selectedSuggestionsIndex < selectedOptionsLimit) setSelectedOptionsIndex(prev => prev + 1)
                  }
                  else if (e.key == "ArrowUp") {
                    e.stopPropagation()
                    e.preventDefault()

                    if (selectedSuggestionsIndex > 0) setSelectedOptionsIndex(prev => prev - 1)
                  }
                  else if (e.key == "Enter") {
                    e.stopPropagation()
                    e.preventDefault()

                    replaceCurrentWord(matchingWords[selectedSuggestionsIndex])
                  }
                }
              }}
              onScroll={() => {
                setDropdownPosition(prev => ({
                  ...prev,
                  visible: false,
                  visibilityChangeReason: 'scroll'
                }))
              }}
              onSelect={handleSelect}
              onInput={handleInput}
              spellCheck={false}
              placeholder="Paste YAML permissions here and click Load YAML below."
            />

            <div
              className="absolute w-full p-2 top-0 left-0"
              ref={mirrorRef}
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                visibility: 'hidden',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
            />

            {
              dropdownPosition.visible && matchingWords.length > 0 && (
                <div
                  className="border absolute z-50 rounded-sm bg-white right-2 top-2"
                // style={{
                //   top: dropdownPosition.top,
                //   left: dropdownPosition.left,
                // }}
                >
                  {matchingWords.slice(0, 10).map((word, index) => (
                    <div
                      className={`px-4 py-1.5 border hover:bg-slate-200 cursor-pointer ${index == selectedSuggestionsIndex ? 'bg-slate-200' : ""}`}
                      key={index}
                      onClick={() => {
                        replaceCurrentWord(word)
                      }}
                    >{word}</div>
                  ))}
                </div>
              )
            }
          </div>

          <div className="mt-2 flex space-x-2">
            <Button onClick={onYamlLoad} variant="outline" size="sm">
              Load YAML
            </Button>
            <Button
              onClick={() => {
                toast({ title: "YAML Exported", description: "Permissions YAML copied to clipboard." });
                navigator.clipboard.writeText(yamlInput);
              }}
              variant="default"
              size="sm"
            >
              Copy YAML
            </Button>
            <Input
              className="w-56"
              type="file"
              accept=".yaml,.yml"
              multiple={false}
              onChange={handleFile}
            />
            <DownloadYaml
              yamlContent={yamlInput}
            />
          </div>
        </div>

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
            onReorderGroup={() => { }}
            onReorderChild={() => { }}
            onReorderAction={() => { }}
            apiResources={apiResources}
          />
        </TooltipProvider>
      </section>
    </div>
  );
};

export default PermissionEditor;
