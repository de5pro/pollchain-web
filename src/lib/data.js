import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
]

export const candidates = [
    {
      id: 1,
      name: "Alex Johnson",
      address:
        "04414b1ffabcbdd4b74ebd68f4f5ecfa15600426f3a2fe95247afa0636e1d7251f50ed1afd4e975c8305cb86a6187e26ec4f45348baac39a0d6bf6c066b9d2152c",
      image:
        "https://cdn.antaranews.com/cache/1200x800/2024/10/03/000_36J26WD.jpg",
        votes: 0,
    },
    {
        id: 2,
        name: "Sam Rodriguez",
        address:
        "04a21b31dcc89d13e4fb78cb5f8e2505a49ae8eed9d4b6b9495ab9dec05686e249f537e2850f9bdd58b8bd04e9e30663267d614eba120a97b159448e58cdeeba05",
        image:
        "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/3a97/live/0dac61f0-d7a9-11ee-8f28-259790e80bba.jpg",
        votes: 0,
    },
    {
        id: 3,
        name: "Jordan Lee",
        address:
        "049a94e4bde78b026dfdc764c317949a866bd2731ae0be9f15b3f8ba382ced8ef5cb3ffddc51c10c951342265e105102fd1b3d55e99066e7bacdf591726d49d4aa",
      image:
      "https://static.independent.co.uk/2024/10/28/09/27-3c5ee0b831ca40e8843478fb62e81cd8.jpg",
      votes: 0,
    },
];

export const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Newsletter', href: '/newsletter' },
        { name: 'Events', href: '/events' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Cookies', href: '/cookies' },
      ],
    },
  ]
  
export const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
]