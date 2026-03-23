# Design Tokens Source of Truth

This directory is the editable source for all design tokens.

## Taxonomy
- `core/`: primitive values used across the system.
- `semantic/`: intent-based aliases referencing core values.
- `components/`: component-specific aliases for consistent styling.

## Naming Rules
- JSON keys are flattened to CSS variables with kebab-case.
- Example: `color.vinco.cream` -> `--color-vinco-cream`
- Keep primitive names stable; add semantic/component tokens for UI intent.

## Current Legacy Mapping
- `--color-vinco-*`, `--font-*`, `--font-size-*`, `--line-height-*`, `--letter-spacing-*`
- `--spacing-*`, `--breakpoint-*`, `--container-content`
- `--ease-vinco`, `--duration-*`

These existing variable names are intentionally preserved to avoid visual regressions.

## Editing Workflow
1. Edit JSON files in this folder.
2. Run `pnpm tokens:build`.
3. Use generated variables from `src/styles/tokens.generated.css`.
