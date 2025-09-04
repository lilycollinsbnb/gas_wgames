import React, { useState, useEffect } from 'react'
import { ChevronRight } from '@/components/icons/chevron-right'
import { ChevronDown } from '@/components/icons/chevron-down'
import { MinusIcon } from '@/components/icons/minus-icon'
import ActiveLink from '@/components/ui/links/active-link'
import { CategoryTree, CategoryTreeNode } from '@/types'
import { useSelectedCategories } from './lib/use-selected-categories'
import { useExpandedCategories } from './lib/use-expanded-categories'

type CategoryTreeProps = {
  categoryTree: CategoryTree
}

const CategoryTreeView: React.FC<CategoryTreeProps> = ({ categoryTree }) => {
  const { selectedCategories, handleCheckboxChange } = useSelectedCategories()
  const { expandedNodes, toggleNode } = useExpandedCategories()

  // Recursive function to render the category accordion
  const renderCategoryAccordion = (
    { category, children }: CategoryTreeNode,
    level = 0
  ) => {
    if (!category.is_visible_in_tree) return null

    const isExpanded = expandedNodes[category.id] ?? false
    const isChecked = selectedCategories.has(category?.slug)

    return (
      <div key={category.id}>
        <div
          className="flex cursor-default items-center py-2"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <div className="flex items-center space-x-2">
            {children && children.length > 0 && (
              <span
                className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleNode(category.id)
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 hover:stroke-blue-600 transition-colors" />
                ) : (
                  <ChevronRight className="h-4 w-4 hover:stroke-blue-600 transition-colors" />
                )}
              </span>
            )}
            {(!children || children?.length === 0) && (
              <MinusIcon className="h-4 w-4" />
            )}
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isChecked}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              onChange={(e) =>
                handleCheckboxChange(category?.slug, e.target.checked)
              }
            />
            <ActiveLink
              href={category.url}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {category.name}
            </ActiveLink>
          </div>
        </div>
        {isExpanded && children && (
          <div className="pl-4">
            {children.map((childNode) =>
              renderCategoryAccordion(childNode, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categoryTree.roots.map((node) => renderCategoryAccordion(node))}
    </div>
  )
}

export default CategoryTreeView
