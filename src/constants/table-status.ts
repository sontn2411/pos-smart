import type { TableStatus } from '@/types/table'

export interface StatusConfig {
  key: TableStatus
  label: string
  shortLabel: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  dotColor: string
  ringColor: string
  badgeBg: string
  badgeText: string
  description: string
}

export const TABLE_STATUS_CONFIG: Record<TableStatus, StatusConfig> = {
  available: {
    key: 'available',
    label: 'Available',
    shortLabel: 'Available',
    color: '#10b981',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    dotColor: 'bg-emerald-500',
    ringColor: 'ring-emerald-400',
    badgeBg: 'bg-emerald-600',
    badgeText: 'text-white',
    description: 'Ready for guests',
  },
  reserved: {
    key: 'reserved',
    label: 'Reserved',
    shortLabel: 'Reserved',
    color: '#f59e0b',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-500',
    ringColor: 'ring-amber-400',
    badgeBg: 'bg-amber-600',
    badgeText: 'text-white',
    description: 'Booked in advance',
  },
  occupied: {
    key: 'occupied',
    label: 'Occupied',
    shortLabel: 'Occupied',
    color: '#3b82f6',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-500',
    ringColor: 'ring-blue-400',
    badgeBg: 'bg-blue-600',
    badgeText: 'text-white',
    description: 'Guests seated',
  },
  ordered: {
    key: 'ordered',
    label: 'Ordered',
    shortLabel: 'Ordered',
    color: '#8b5cf6',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    dotColor: 'bg-purple-500',
    ringColor: 'ring-purple-400',
    badgeBg: 'bg-purple-600',
    badgeText: 'text-white',
    description: 'Order placed',
  },
  waiting_food: {
    key: 'waiting_food',
    label: 'Waiting Food',
    shortLabel: 'Waiting',
    color: '#f97316',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
    dotColor: 'bg-orange-500',
    ringColor: 'ring-orange-400',
    badgeBg: 'bg-orange-600',
    badgeText: 'text-white',
    description: 'Kitchen preparing',
  },
  out_of_order: {
    key: 'out_of_order',
    label: 'Out of Order',
    shortLabel: 'Out of Order',
    color: '#78716c',
    bgColor: 'bg-stone-100',
    textColor: 'text-stone-600',
    borderColor: 'border-stone-300',
    dotColor: 'bg-stone-500',
    ringColor: 'ring-stone-400',
    badgeBg: 'bg-stone-700',
    badgeText: 'text-white',
    description: 'Temporarily closed',
  },
}

export const ALL_TABLE_STATUSES: TableStatus[] = [
  'available',
  'occupied',
  'waiting_food',
  'ordered',
  'reserved',
  'out_of_order',
]
