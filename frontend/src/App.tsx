import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "./pages/MainPage"
import { AuthPage } from "./pages/AuthPage"
import { AuthCallbackPage } from "./pages/AuthCallbackPage"
import { MePage } from "@/pages/MePage"
import { DecksPage } from "./pages/DecksPage"
import { DeckDetailPage } from "./pages/DeckDetailPage"
import { ReviewSessionPage } from "@/pages/ReviewSessionPage"
import { Header } from "@/components/Header/Header"
import { Outlet } from "react-router-dom"
import { HowThisWorksPage } from "./pages/HowThisWorksPage"
import { ReviewMenuPage } from "@/pages/ReviewMenuPage"

function Layout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="shrink-0">
        <Header />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/how", element: <HowThisWorksPage /> },
      { path: "/login", element: <AuthPage /> },
      { path: "/register", element: <AuthPage /> },
      { path: "/me", element: <MePage /> },
      { path: "/decks", element: <DecksPage /> },
      { path: "/decks/:id", element: <DeckDetailPage /> },
      { path: "/review/", element: <ReviewMenuPage /> },
      { path: "/review/deck/:id", element: <ReviewSessionPage /> },
      { path: "/review/all", element: <ReviewSessionPage /> },
      { path: "/auth/:provider/callback", element: <AuthCallbackPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
