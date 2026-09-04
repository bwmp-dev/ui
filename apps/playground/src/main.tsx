import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, ToastProvider, Toaster, TooltipProvider } from '@bwmp-dev/ui'
import { Playground } from './playground'
import './styles.css'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element in index.html')

createRoot(container).render(
  <StrictMode>
    <ThemeProvider defaultAppearance="dark" storageKey="stack:playground">
      <ToastProvider>
        <TooltipProvider>
          <Playground />
          <Toaster />
        </TooltipProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
