import { createTheme, ThemeProvider } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { Routes, Route } from "react-router-dom";
import MyNotes from "./pages/mynotes/mynotes.component";
import Navigation from "./pages/navigation/navigation.component";
import SharedNotes from "./pages/shared notes/shared.component";
import SignIn from "./pages/sign in page/signin.component";

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: green
  },
  typography: {
    fontFamily: "Poppins, sans-serif"
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Navigation />}>
          <Route index element={<MyNotes />} />
          <Route path="/shared-notes" element={<SharedNotes />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
