import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from '@/hooks/useSettings'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { Home } from '@/routes/Home'
import { NotFound } from '@/routes/NotFound'
import { Styleguide } from '@/routes/Styleguide'

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <SiteLayout hasHero gate>
                <Home />
              </SiteLayout>
            }
          />

          {/* The styleguide is a build tool, not part of the site. It keeps its
              own header so the shell's nav doesn't sit on top of the specimens. */}
          <Route path="/styleguide" element={<Styleguide />} />

          <Route
            path="*"
            element={
              <SiteLayout showDock={false} showBot={false}>
                <NotFound />
              </SiteLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}
