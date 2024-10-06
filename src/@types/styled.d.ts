import "styled-components";
import { defaultTheme } from "../styles/themes/default";

type ThemeType = typeof defaultTheme;

// sobrescreve a tipagem do DefaultTheme
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
