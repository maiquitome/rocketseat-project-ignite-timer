import styled from "styled-components";

export const HistoryContainer = styled.main`
  flex: 1;
  padding: 3.5rem;
  display: flex;
  flex-direction: column;
  h1 {
    font-size: 1.5rem;
    color: ${(props) => props.theme["gray-100"]};
  }
`;

export const HistoryList = styled.div`
  flex: 1;
  overflow: auto;
  margin-top: 2rem;
  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
    th {
      background-color: ${(props) => props.theme["gray-600"]};
      padding: 1rem;
      text-align: left;
      color: ${(props) => props.theme["gray-100"]};
      font-size: 0.875rem;
      line-height: 1.6;
      &:first-child {
        border-top-left-radius: 8px;
        padding-left: 1.5rem;
      }
      &:last-child {
        border-top-right-radius: 8px;
        padding-right: 1.5rem;
      }
    }
    td {
      background-color: ${(props) => props.theme["gray-700"]};
      border-top: 4px solid ${(props) => props.theme["gray-800"]};
      padding: 1rem;
      font-size: 0.875rem;
      line-height: 1.6;
      &:first-child {
        width: 50%;
        padding-left: 1.5rem;
      }
      &:last-child {
        padding-right: 1.5rem;
      }
    }
  }
`;

const STATUS_COLORS = {
  yellow: "yellow-500",
  green: "green-500",
  red: "red-500",
} as const;

interface StatusProps {
  $statusColor: keyof typeof STATUS_COLORS;
}

/*
  - ERRO: styled-components: it looks like an unknown prop "statusColor" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.) 

  - Solução foi adicionar um prefixo $ na propriedade: `statusColor` to `$statusColor`

  - Usando dessa forma evita o erro de props desconhecida no DOM.

  - link da solução: https://github.com/rocketseat-education/02-ignite-timer/commit/1ea6d7b#diff-21f4dd2a68b5327188fcd8e98419eb81ef218b9af0e9cedb45cf4b5b267f80a3R74
*/

export const Status = styled.span<StatusProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &::before {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: ${(props) => props.theme[STATUS_COLORS[props.$statusColor]]};
  }
`;
