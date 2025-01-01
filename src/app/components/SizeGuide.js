'use client'
import React from 'react'
import { FaTimes } from 'react-icons/fa'

export default function SizeGuide({ onClose }) {
  const sizeChart = {
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)'],
    rows: [
      ['S', '36-38', '30-32', '27'],
      ['M', '38-40', '32-34', '28'],
      ['L', '40-42', '34-36', '29'],
      ['XL', '42-44', '36-38', '30'],
    ]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">Size Guide</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {sizeChart.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-left text-black"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeChart.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border-t px-4 py-2 text-black"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-medium text-black mb-2">How to Measure</h3>
              <p className="text-sm text-black">
                For the best fit, measure yourself as follows:
              </p>
              <ul className="list-disc list-inside text-sm text-black mt-2 space-y-1">
                <li>Chest: Measure around the fullest part of your chest</li>
                <li>Waist: Measure around your natural waistline</li>
                <li>Length: Measure from shoulder to hem</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-black">
                <strong>Tip:</strong> If you are between sizes, we recommend going up a size for a more comfortable fit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 