import Link from 'next/link'
import { footerLinks, socialLinks } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="bg-[#001A1E] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors">
              <span className="text-xl font-light">PollPal</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Empowering students to participate in democracy securely and efficiently.
            </p>
          </div>
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-medium text-white">{column.title}</h3>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">&copy; 2024 PollPal. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{link.name}</span>
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

