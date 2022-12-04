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
