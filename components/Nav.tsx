import Link from 'next/link'

function Nav(): React.ReactElement {
  return (
    <nav className="py-1 border-b border-gray-200">
      <div className="container mx-auto flex flex-row justify-between items-center px-5">
        <Link href="/">
          <a className="logo font-extrabold text-3xl text-primary font-serif">
            bard.
          </a>
        </Link>
      </div>
    </nav>
  )
}

export default Nav
