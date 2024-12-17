'use client'
import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Body from './components/Body'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Body />
      </main>
      <Footer />
    </div>
  )
}
