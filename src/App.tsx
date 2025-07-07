import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "@/components/Header";

const HomePage = lazy(() => import("@/pages/HomePage"));
const DetailPage = lazy(() => import("@/pages/DetailPage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const App = () => {
  return (
    <>
      <Header />
      <main className="pt-4">
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pokemon/:pokemonName" element={<DetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

export default App;
