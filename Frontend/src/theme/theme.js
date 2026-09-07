import { createTheme } from "@mui/material/styles";

// Single source of truth for the dark editorial theme. 21 files pull in MUI
// components (inputs, dialogs, menus, selects); theming them here beats hand-
// patching `sx` on every one of them, and keeps MUI in step with the Tailwind
// palette instead of drifting from it.
//
// Palette lock: zinc neutrals + exactly one accent (deep rose). Mirrors the
// `accent` scale in tailwind.config.js - change both together.
const zinc = {
  950: "#09090b",
  900: "#18181b",
  800: "#27272a",
  700: "#3f3f46",
  400: "#a1a1aa",
  200: "#e4e4e7",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#e11d54", contrastText: "#ffffff" },
    secondary: { main: "#a1a1aa" },
    background: { default: zinc[950], paper: zinc[900] },
    text: { primary: "#fafafa", secondary: zinc[400] },
    divider: "rgba(255,255,255,0.10)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    // MUI's default contained button is loud; the site's button language is a
    // white or accent pill with a tactile press.
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.04)",
          "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
        },
        // Chrome's autofill fill ignores background-color; only an inset shadow
        // covers it. Matching the field's own painted colour (#242426) keeps an
        // autofilled field visually identical to an empty one.
        input: {
          "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
            {
              WebkitTextFillColor: "#fafafa",
              WebkitBoxShadow: "0 0 0 1000px #242426 inset",
              boxShadow: "0 0 0 1000px #242426 inset",
              caretColor: "#fafafa",
              borderRadius: "inherit",
              transition: "background-color 100000s ease-in-out 0s",
            },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: "1px solid rgba(255,255,255,0.08)" },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { backgroundColor: zinc[900] } },
    },
  },
});

export default theme;
