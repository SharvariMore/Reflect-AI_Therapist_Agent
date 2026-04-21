"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Flower2 } from "lucide-react"

/* Decorative Items for garden */
const items = [
  { type: "rock", icon: "🪨" },
  { type: "flower", icon: "🌸" },
  { type: "tree", icon: "🌳" },
  { type: "bamboo", icon: "🎋" },
]

export default function ZenGarden() {
  const [placedItems, setPlacedItems] = useState<
    Array<{
      type: string
      icon: string
      /* Remember Placement of the item in garden */
      x: number /* x-coordinate of  item */
      y: number /* y-coordinate of  item */
    }>
  >([])
  const [selectedItem, setSelectedItem] = useState(items[0])

    /* Finds item by its x and y coordinates relative to canvas */
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    /* Updates item by taking all existing items and adding the new item with its x and y coordinates which is a copy of selected item */
    setPlacedItems([...placedItems, { ...selectedItem, x, y }])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        {items.map((item) => (
          <motion.button
            key={item.type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedItem(item)}
            className={`rounded-lg p-3 ${
              selectedItem.type === item.type ? "bg-primary/20" : "bg-primary/5"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
          </motion.button>
        ))}
      </div>

      <div
        onClick={handleCanvasClick}
        className="relative h-[400px] w-full cursor-pointer overflow-hidden rounded-lg bg-primary/5"
      >
        {placedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              left: item.x - 12,
              top: item.y - 12,
            }}
            className="text-2xl"
          >
            {item.icon}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
