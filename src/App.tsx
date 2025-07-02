import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import DetailPage from "@/pages/DetailPage";
import FavoritesPage from "@/pages/FavoritesPage";
import { Header } from "@/components/Header";

const App = () => {
  return (
    <>
      <Header />

      <main className="pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:name" element={<DetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
