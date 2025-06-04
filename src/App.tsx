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
import SigninPage from "./pages/SigninPage/SigninPage";
import SignupPage from "./pages/SignupPage/SignupPage";

function App() {
  return (
    <>
      <MessageContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth">
              <Route path="/auth/signin" element={<SigninPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
            </Route>
            <Route path="/" element={<AppLayout />}>
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
