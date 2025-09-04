import { useEffect, useState } from "react";

export const useExpandedCategories = () => {
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
    useEffect(() => {
      const expandedStateFromStorage = JSON.parse(localStorage.getItem('expandedState') || '{}');
      setExpandedNodes(expandedStateFromStorage);
    }, []);
  
    const toggleNode = (nodeId: string) => {
      setExpandedNodes((prev) => {
        const newState = { ...prev, [nodeId]: !prev[nodeId] };
        localStorage.setItem('expandedState', JSON.stringify(newState));
        return newState;
      });
    };
  
    return { expandedNodes, toggleNode };
  };