import { HeadContent, Scripts, createRootRoute, useLocation, Link, useRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SoftBackdrop } from '../components/portfolio/SoftBackdrop'
import { Shell } from '../components/portfolio/Shell'
import { PageTransition } from '../components/portfolio/PageTransition'
import { useEffect } from 'react'
import appCss from '../styles.css?url'

const queryClient = new QueryClient()

// Report error telemetry helper
function reportLovableError(error: unknown) {
  console.error("[Lovable Error Telemetry Logger]:", error)
}

// 404 Fallback component
function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-sm mx-auto page-transition">
      <h2 className="text-5xl font-serif font-bold text-text-primary">
        404<span className="text-accent-terracotta">.</span>
      </h2>
      <p className="text-sm text-text-secondary">
        Nothing indexed here.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-full bg-accent-terracotta text-white text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm mt-2"
      >
        Back home
      </Link>
    </div>
  )
}

// Error Boundary fallback component
interface ErrorProps {
  error: any;
  reset: () => void;
}

function ErrorComponent({ error, reset }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    reportLovableError(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto page-transition">
      <h2 className="text-3xl font-serif font-bold text-text-primary">
        This page didn't load<span className="text-accent-terracotta">.</span>
      </h2>
      <p className="text-xs text-text-muted leading-relaxed max-w-xs">
        {error instanceof Error ? error.message : "An unexpected system error occurred."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => {
            router.invalidate()
            reset()
          }}
          className="px-5 py-2.5 rounded-xl bg-accent-terracotta text-white text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try again
        </button>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl border border-border text-text-primary text-xs font-mono uppercase tracking-wider hover:bg-bg-elevated transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

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
      {
        name: 'description',
        content: 'Aniket Saini\'s personal portfolio and technical development log.',
      },
      {
        property: 'og:title',
        content: 'Aniket Saini | Data Portfolio',
      },
      {
        property: 'og:description',
        content: 'Aniket Saini\'s personal portfolio and technical development log.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
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
          <SoftBackdrop />
          <Shell>
            <ContentWrapper>
              {children}
            </ContentWrapper>
          </Shell>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
