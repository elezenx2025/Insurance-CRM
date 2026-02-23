'use client'

import React from 'react'

interface PieChartData {
  label: string
  value: number
  color: string
  percentage: number
}

interface PieChartProps {
  data: PieChartData[]
  size?: number
  onSegmentClick?: (segment: string) => void
  legendColumns?: number // Number of columns for legend layout
}

export default function PieChart({ data, size = 200, onSegmentClick, legendColumns = 1 }: PieChartProps) {
  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2

  let cumulativePercentage = 0

  const createPath = (percentage: number, index: number) => {
    const startAngle = (cumulativePercentage * 360) - 90
    const endAngle = ((cumulativePercentage + percentage) * 360) - 90
    
    cumulativePercentage += percentage

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)

    const largeArcFlag = percentage > 0.5 ? 1 : 0

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return pathData
  }

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': '#3B82F6',
      'bg-green-500': '#10B981',
      'bg-orange-500': '#F59E0B',
      'bg-red-500': '#EF4444',
      'bg-purple-500': '#8B5CF6',
      'bg-yellow-500': '#EAB308',
      'bg-indigo-500': '#6366F1',
      'bg-pink-500': '#EC4899',
      'bg-teal-500': '#14B8A6',
      'bg-cyan-500': '#06B6D4'
    }
    return colorMap[color] || '#6B7280'
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <g>
          {data.map((segment, index) => {
            const pathData = createPath(segment.percentage / 100, index)
            const fillColor = getColorClass(segment.color)
            
            return (
              <path
                key={index}
                d={pathData}
                fill={fillColor}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSegmentClick?.(segment.label)}
              />
            )
          })}
        </g>
      </svg>
      
      {/* Legend */}
      <div 
        className={`mt-4 grid gap-2`}
        style={{ gridTemplateColumns: `repeat(${legendColumns}, minmax(0, 1fr))` }}
      >
        {data.map((segment, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => onSegmentClick?.(segment.label)}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                style={{ backgroundColor: getColorClass(segment.color) }}
              ></div>
              <span className="text-sm text-gray-600 whitespace-nowrap">{segment.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 ml-2">
              {segment.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
