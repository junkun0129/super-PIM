import { Column } from "./components/AppTable/type";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";
import { AppRoutes } from "./routes";
import SeriesCreatePage from "./pages/SeriesCreatePage/SeriesCreatePage";
import SkuDetailPage from "./pages/SkuDetailPage/SkuDetailPage";
import MainPage from "./pages/MainPage/MainPage";
import { MessageContextProvider } from "./providers/MessageContextProvider";
import SettingPage from "./pages/SettingPage/SettingPage";
import SeriesDetailPage from "./pages/SeriesDetail/SeriesDetailPage";

const users = [
  { id: 1, name: "John Doe", age: 28 },
  { id: 2, name: "Jane Smith", age: 34 },
  { id: 3, name: "Alice Johnson", age: 22 },
];

const userColumns: Column<(typeof users)[0]>[] = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Age", accessor: "age" },
];
function App() {
  return (
    <>
      <MessageContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/app" element={<AppLayout />}>
              <Route path={AppRoutes.serisListPage} element={<MainPage />} />
              <Route
                path={AppRoutes.seriesDetailPage}
                element={<SeriesDetailPage />}
              />
              <Route
                path={AppRoutes.seriesCreatePage}
                element={<SeriesCreatePage />}
              />

              <Route
                path={AppRoutes.skuDetailPage}
                element={<SkuDetailPage />}
              />
              <Route path={AppRoutes.settingPage} element={<SettingPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MessageContextProvider>
    </>
  );
}

export default App;
