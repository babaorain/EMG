import { useEffect, useState } from 'react'

/**
 * Layout differences between phone and desktop are structural here — the filter
 * rail becomes a sheet, the queue becomes an action bar — so the breakpoint has
 * to be readable from JS, not only from CSS.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = () => setMatches(list.matches)
    onChange()
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * Below this width the three-column workspace squeezes the muscle rows too
 * hard, so phones *and* tablets/small laptops get the touch layout: filters in
 * a sheet and the queue in a bottom action bar. Keep in sync with App.css.
 */
export const COMPACT_QUERY = '(max-width: 1149px)'
