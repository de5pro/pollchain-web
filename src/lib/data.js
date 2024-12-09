import { Twitter, Linkedin, Instagram, Github } from 'lucide-react'

export const navItems = [
    { name: 'Home', href: '/', target: '_self' },
    { name: 'About', href: 'https://www.canva.com/design/DAGYlOYS90E/Uq9ateVu2gpXCJZ1HBBGkw/view?utm_content=DAGYlOYS90E&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hbfaead39f5', target: '_blank' },
    { name: 'Details', href: '/details', target: '_self' },
    { name: 'Live', href: '/live', target: '_self' },
]

export const polling = {
  header: "User Opinion Poll:",
  title: "Best Food in Kantek",
  description: "Your voice matters. Participate in the most transparent and secure polling experience.",
}

export const candidates = [
    {
      id: 1,
      name: "Nasi Goreng",
      address:
        "047d6e82506c8a399ec2e0637ab3dd0202e14812f527ea3d180683d9a310870a28d5d113d07491afb27ef2161862b684bb9692a8572637ac814f6ff270e82b7281",
      image:
        "https://asset.kompas.com/crops/U6YxhTLF-vrjgM8PN3RYTHlIxfM=/84x60:882x592/1200x800/data/photo/2021/11/17/61949959e07d3.jpg",
      votes: 0,
      subtitle: "Makanan Indonesia",
      description: "Nasi goreng adalah ikon kuliner Indonesia yang menggabungkan nasi putih yang digoreng dengan bumbu-bumbu khas seperti kecap, bawang merah, dan cabai, sering disajikan dengan telur mata sapi dan pelengkap seperti acar atau kerupuk.",
    },
    {
      id: 2,
      name: "Teriyaki Ayam",
      address:
      "0476d49019e3335b458ce7fa1d62248b8ac31d7f202cd776dabdef2e675cc88b0ef29c62ef83e3db166db70d21403a644e1ca59c4dcb0ea2c0e76ffbf07bf492a6",
      image:
      "https://img.taste.com.au/ZoXh6_qy/taste/2010/01/chicken-teriyaki-hero-199548-1.jpg",
      votes: 0,
      subtitle: "HIdangan Jepang",
      description: "Teriyaki ayam adalah hidangan Jepang klasik dengan ayam yang dimasak dengan saus teriyaki yang manis dan mengkilat. Dipanggang atau digoreng dengan sempurna, menciptakan perpaduan rasa manis, asin, dan sedikit asam yang menggugah selera.",
    },
    {
      id: 3,
      name: "Donburi Sambal Matah",
      address:
      "0453c12103e340df0c7756ab1638ce357315232b0085ace1eab292a73d352514b5c68dda17eb4bd7643b377fbb992ae2073e7bcff9a6458a757035d98f1e92755e",
      image:
      "https://assets.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/2023/05/27/chicken-katsu-sambal-matah-3887640167.jpg",
      votes: 0,
      subtitle: "Mangkuk Tradisional Jepang",
      description: "Donburi Sambal Matah adalah perpaduan unik antara hidangan Jepang klasik dengan cita rasa Indonesia. Nasi dengan topping ayam disajikan dengan sambal matah khas Bali, menciptakan ledakan rasa segar, pedas, dan aromatik yang memanjakan lidah.",
    },
];

export const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About', href: 'https://www.canva.com/design/DAGYlOYS90E/Uq9ateVu2gpXCJZ1HBBGkw/view?utm_content=DAGYlOYS90E&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hbfaead39f5' },
        { name: 'Careers', href: '/' },
        { name: 'Press', href: '/' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/' },
        { name: 'Newsletter', href: '/' },
        { name: 'Events', href: '/' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms', href: '/' },
        { name: 'Privacy', href: '/' },
        { name: 'Cookies', href: '/' },
      ],
    },
  ]
  
export const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/de5pro' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
]