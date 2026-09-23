export type TableStatus =
  | 'available'    // Bàn trống (sẵn sàng đón khách)
  | 'reserved'     // Đã đặt trước
  | 'occupied'     // Đang có khách
  | 'ordered'      // Đã gọi món
  | 'waiting_food' // Đang chờ bếp lên món
  | 'out_of_order' // Bàn hỏng / bảo trì

export interface PlacedTable {
  id: string
  name: string
  x: number
  y: number
  size?: number
  rotation?: number
  templateType?: string
  status?: TableStatus
  customerCount?: number
}
