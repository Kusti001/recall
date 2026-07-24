import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "./pages/MainPage"
import { LoginPage } from "./pages/LoginPage"
import { AuthCallbackPage } from "./pages/AuthCallbackPage"
import { MePage } from "@/pages/MePage"
import { DecksPage } from "./pages/DecksPage"
import { DeckDetailPage } from "./pages/DeckDetailPage"
import { ReviewPage } from "./pages/ReviewPage"
import { Header } from "@/components/Header/Header"
import { Outlet } from "react-router-dom"
import { HowThisWorksPage } from "./pages/HowThisWorksPage"

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/how", element: <HowThisWorksPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/me", element: <MePage /> },
      { path: "/decks", element: <DecksPage /> },
      { path: "/decks/:deckId", element: <DeckDetailPage /> },
      { path: "/review", element: <ReviewPage /> },
      { path: "/auth/:provider/callback", element: <AuthCallbackPage /> }
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
