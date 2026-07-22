import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MainPage } from "./pages/MainPage"
import { LoginPage } from "./pages/LoginPage"
import { AuthCallbackPage } from "./pages/AuthCallbackPage"
import { MePage } from "@/pages/MePage"
import { DecksPage } from "./pages/DecksPage"
import { DeckDetailPage } from "./pages/DeckDetailPage"
import { ReviewPage } from "./pages/ReviewPage"
import { Navbar } from "./components/Navbar"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <MainPage /> },
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
