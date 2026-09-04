/**
 * @stack/ui
 *
 * Exports are intentional: everything here is part of the supported surface.
 * The `variants` objects are exported alongside their components so a project
 * can extend them (`cv({ base: buttonVariants.variants… })`) rather than fork.
 *
 * Two things live behind subpaths because they carry an optional peer
 * dependency: `@stack/ui/table` (TanStack Table) and `@stack/ui/form`
 * (TanStack Form). Nothing in the main entry point imports either.
 */

// Core
export { Button, IconButton, LinkButton, buttonVariants } from './core/button'
export type { ButtonProps, ButtonVariants, IconButtonProps, LinkButtonProps } from './core/button'
export { Badge, badgeVariants } from './core/badge'
export type { BadgeProps } from './core/badge'
export { Card, cardVariants } from './core/card'
export type { CardProps } from './core/card'
export { Separator, Skeleton, Kbd, Code } from './core/primitives'
export type { SeparatorProps, SkeletonProps, KbdProps, CodeProps } from './core/primitives'
export { Spinner } from './core/spinner'
export type { SpinnerProps } from './core/spinner'
export { Avatar, avatarVariants } from './core/avatar'
export type { AvatarProps } from './core/avatar'
export { Progress } from './core/progress'
export type { ProgressProps } from './core/progress'

// Forms
export { Field, FormSection } from './forms/field'
export type { FieldProps, FieldLabelProps, FormSectionProps } from './forms/field'
export { Input, Textarea, controlVariants } from './forms/input'
export type { InputProps, TextareaProps, ControlVariants } from './forms/input'
export { Checkbox, RadioGroup, Switch } from './forms/toggles'
export type { CheckboxProps, RadioGroupProps, RadioProps, SwitchProps } from './forms/toggles'
export { Select } from './forms/select'
export type { SelectTriggerProps, SelectContentProps, SelectItemProps } from './forms/select'
export { Combobox } from './forms/combobox'
export type { ComboboxInputProps, ComboboxContentProps } from './forms/combobox'
export { Slider } from './forms/slider'
export type { SliderProps } from './forms/slider'
export { NumberInput } from './forms/number-input'
export type { NumberInputProps } from './forms/number-input'

// Overlays
export { Dialog, dialogContentVariants } from './overlays/dialog'
export type { DialogContentProps } from './overlays/dialog'
export { AlertDialog } from './overlays/alert-dialog'
export { Drawer, drawerContentVariants } from './overlays/drawer'
export type { DrawerContentProps } from './overlays/drawer'
export { Popover, Tooltip, TooltipProvider } from './overlays/popover'
export type { PopoverContentProps, TooltipProps } from './overlays/popover'
export { DropdownMenu, ContextMenu } from './overlays/menu'
export type { MenuItemProps, MenuContentProps } from './overlays/menu'
export { CommandMenu } from './overlays/command-menu'
export type { CommandAction, CommandMenuProps } from './overlays/command-menu'

// Navigation
export { Tabs, tabsListVariants } from './navigation/tabs'
export type { TabsProps, TabsListProps, TabProps } from './navigation/tabs'
export { Breadcrumbs } from './navigation/breadcrumbs'
export type { BreadcrumbsProps, BreadcrumbItemProps } from './navigation/breadcrumbs'
export { Pagination } from './navigation/pagination'
export type { PaginationProps } from './navigation/pagination'
export { Sidebar } from './navigation/sidebar'
export type { SidebarProps, SidebarItemProps, SidebarGroupProps } from './navigation/sidebar'
export { Navbar, NavigationMenu } from './navigation/navbar'
export type { NavbarProps, NavbarLinkProps } from './navigation/navbar'

// Feedback
export { Alert, alertVariants } from './feedback/alert'
export type { AlertProps } from './feedback/alert'
export { ToastProvider, Toaster, useToast } from './feedback/toast'
export type { ToasterProps, ToastProviderProps, ToastTone } from './feedback/toast'
export { EmptyState, ErrorState, LoadingState } from './feedback/states'
export type { EmptyStateProps, ErrorStateProps, LoadingStateProps } from './feedback/states'

// Application layout
export { AppShell, Page, PageHeader } from './app/app-shell'
export type { AppShellProps, PageProps, PageHeaderProps } from './app/app-shell'
export { Toolbar, SearchInput, FilterBar } from './app/toolbar'
export type { ToolbarProps, SearchInputProps, FilterBarProps } from './app/toolbar'
export { PropertyPanel, SettingsSection } from './app/panels'
export type { PropertyPanelProps, PropertyProps, SettingsSectionProps } from './app/panels'
export { SplitPane } from './app/split-pane'
export type { SplitPaneProps } from './app/split-pane'

// Theming
export {
  ThemeProvider,
  useTheme,
  useAppearanceToggle,
  themeInitScript,
} from './theme/theme-provider'
export type { ThemeProviderProps, ThemeState, AppearanceSetting } from './theme/theme-provider'
