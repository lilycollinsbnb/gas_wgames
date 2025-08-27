import * as React from 'react';
import ActiveLink from './active-link';
import classNames from 'classnames';
import { CategoryTree, CategoryTreeNode } from '@/types'; // Import necessary types

export interface ICategoryBreadcrumbsProps {
  categoryTree: CategoryTree; // Accept the entire category tree
  currentCategorySlug: string; // Current category slug to find in the tree
}

export default function CategoryBreadcrumbs({
  categoryTree,
  currentCategorySlug,
}: ICategoryBreadcrumbsProps) {
  // Function to find the current category and build the breadcrumb path
  const buildBreadcrumbPath = (
    node: CategoryTreeNode,
    path: CategoryTreeNode[] = []
  ): CategoryTreeNode[] | null => {
    // Check if the current node matches the category slug
    if (node.category.slug === currentCategorySlug) {
      return [...path, node]; // Return the path if found
    }

    // Recursively search in the children
    for (const child of node.children || []) {
      const result = buildBreadcrumbPath(child, [...path, node]);
      if (result) {
        return result; // If found, return the path
      }
    }

    return null; // Not found
  };

  // Build the breadcrumb path by searching through all root nodes
  const breadcrumbPath = categoryTree.roots
    .flatMap((root) => buildBreadcrumbPath(root))
    .filter(Boolean) // Filter out any null results
    .flat(); // Flatten the resulting array

  if (!breadcrumbPath.length) {
    return null; // Return null if the category is not found
  }

  return (
    <div aria-label="breadcrumb">
      <ol
        className="breadcrumb"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {breadcrumbPath.map((node, index) => {
          const href = node?.category.url!; // Use the category's URL directly
          const isActive = index === breadcrumbPath.length - 1;
          const segmentName = node?.category.name; // Use category name for display

          return (
            <li
              key={index}
              style={{ display: 'flex', alignItems: 'center' }}
              className={classNames({ active: isActive })}
            >
              {index !== 0 && <span style={{ margin: '0 5px' }}>{'>'}</span>}{' '}
              {/* Separator */}
              {isActive ? (
                <span className="active">{segmentName}</span> // Active class for current page
              ) : (
                <ActiveLink href={href} activeClassName="active">
                  {segmentName}
                </ActiveLink>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
