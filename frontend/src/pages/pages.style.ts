import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const PageContainer = styled.div`
  width: 95%;
  max-width: 1000px;
  margin: 0 auto;
`;

export const PageTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PageActions = styled.div`
  float: right;
`;

export const PageTableContainer = styled.div`
  margin: 4px 0;
  width: 100%;
  /* overflow-x: auto; */
  .arco-table-content-inner {
    overflow-x: auto;
    .arco-table-cell {
      word-break: unset;
    }
  }
`;

export const ModalTableContainer = styled.div`
  .arco-table-content-inner {
    overflow-x: auto;
    .arco-table-cell {
      word-break: unset;
    }
  }
  .arco-table-td {
    padding: 4px;
  }
`;

export const TableExpandedContainer = styled.div`
  > * {
    margin-bottom: 8px;
    flex: 1 1;
  }
  @media only screen and (min-width: 730px) {
    display: flex;
    > * {
      margin-right: 16px;
    }
  }
`;

export const ColumnHideOnNarrow = css`
  @media only screen and (max-width: 850px) {
    display: none;
  }
`