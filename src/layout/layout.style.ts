import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const LayoutContainer = styled.div`
  min-width: 100vw;
  min-height: 100vh;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 4rem;
  padding: 0 6%;
  background-color: var(--pitt-blue);
`;

export const HeaderTitle = styled.div`
  font-family: cursive;
  font-size: 2rem;
  color: white;
  line-height: 4rem;
`;
export const HeaderActions = styled.div`
  line-height: 4rem;
  display: flex;
  align-items: center;
`;

export const AvatarContainer = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  margin-left: 1rem;
`;
