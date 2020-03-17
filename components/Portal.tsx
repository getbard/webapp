import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

function Portal({ children, selector }: {
  children: React.ReactNode;
  selector: string;
}): React.ReactElement {
  const ref = useRef<Element | null>()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.querySelector(selector)
    setMounted(true)
  }, [selector])

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return mounted ? createPortal(children, ref.current) : null
}

export default Portal;