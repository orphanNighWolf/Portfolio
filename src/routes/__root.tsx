import { HeadContent, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionProvider } from '../lib/motion-context'
import { SoftBackdrop } from '../components/portfolio/SoftBackdrop'
import { Shell } from '../components/portfolio/Shell'
import { PageTransition } from '../components/portfolio/PageTransition'
import appCss from '../styles.css?url'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Aniket Saini | Data Portfolio',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  return (
    <PageTransition key={pathname}>
      {children}
    </PageTransition>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <MotionProvider>
            <SoftBackdrop />
            <Shell>
              <ContentWrapper>
                {children}
              </ContentWrapper>
            </Shell>
          </MotionProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
