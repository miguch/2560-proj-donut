import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0 6%;
  background-color: var(--pitt-blue);
`;

export const HeaderTitle = styled.div`
  font-family: cursive;
  font-size: 2rem;
  color: white;
  line-height: 4rem;
  text-decoration: none;
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

export const MainContainer = styled.div`
  margin: 0 auto;
  padding: 12px 6%;
  max-width: 1200px;
`;

export const HeaderNavigationContainer = styled.div``;

export const HeaderNavBar = styled.div`
  @media only screen and (max-width: 800px) {
    display: none;
  }
  line-height: 2.5rem;
  .arco-link {
    margin-left: 4px;
    color: rgb(var(--link-10));
    &:hover {
      color: rgb(var(--link-9));
    }
  }
`;

export const HeaderNavButton = styled.div`
  @media only screen and (min-width: 800px) {
    display: none;
  }
`;

export const HomeContainer = styled.div``;

export const ScheduleItemClass = css`
  width: 20% !important;
  @media only screen and (max-width: 750px) {
    width: 25% !important;
  }
  @media only screen and (max-width: 600px) {
    width: 33% !important;
  }
  @media only screen and (max-width: 480px) {
    width: 50% !important;
  }
`;


export const CalendarCard = css`
  width: calc(100% / 7) !important;

  @media only screen and (max-width: 1250px) {
    width: calc(100% / 4) !important;
  }
  @media only screen and (max-width: 720px) {
    width: calc(100% / 2) !important;
  }
`
