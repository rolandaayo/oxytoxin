'use client'
import React, { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
    toast.success('Message sent successfully! We\'ll get back to you soon.', {
      icon: '📧',
      duration: 3000
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: 'Our Location',
      details: ['123 Fashion Street', 'Design District, NY 10001']
    },
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: 'Phone Number',
      details: ['+1234567890', '+1987654321']
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: 'Email Address',
      details: ['info@oxtoyin.com', 'support@oxtoyin.com']
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 - 22:00', 'Sat - Sun: 10:00 - 20:00']
    }
  ]

  return (
    <div className="min-h-screen pt-16 md:pt-[calc(4rem+32px)]">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/image2.jpeg")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#D6E752] mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-[#D6E752] max-w-2xl">
            We would love to hear from you. Get in touch with us.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-[#D6E752] mb-6">Get In Touch</h2>
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-[#D6E752]">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#D6E752] mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-[#D6E752]">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="font-semibold text-[#D6E752] mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-[#D6E752] hover:text-blue-600 transition-colors">
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-[#D6E752] hover:text-blue-400 transition-colors">
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-[#D6E752] hover:text-pink-600 transition-colors">
                  <FaInstagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-[#D6E752] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#D6E752] mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#D6E752] mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#D6E752] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#D6E752] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#D6E752] text-black py-3 rounded-lg hover:bg-[#c2d248] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="rounded-2xl overflow-hidden h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986652089843!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043276541!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
} 