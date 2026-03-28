import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

// Use a plain <script> via dangerouslySetInnerHTML instead of next/script so
// that newer versions of Next.js / React don't warn about Script tags inside
// client components. This runs synchronously before paint — equivalent to
// strategy="beforeInteractive" but without the React reconciler complaint.
export const InitTheme: React.FC = () => {
  const script = `(function(){function g(){var m=window.matchMedia('(prefers-color-scheme: dark)');return typeof m.matches==='boolean'?m.matches?'dark':'light':null}function v(t){return t==='light'||t==='dark'}var t='${defaultTheme}',p=window.localStorage.getItem('${themeLocalStorageKey}');if(v(p)){t=p}else{var i=g();if(i)t=i}document.documentElement.setAttribute('data-theme',t)})()`
  // eslint-disable-next-line react/no-danger
  return <script id="theme-script" dangerouslySetInnerHTML={{ __html: script }} />
}
