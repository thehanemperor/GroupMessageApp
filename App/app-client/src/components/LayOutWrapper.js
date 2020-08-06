import styled from "styled-components";

const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};

const devices = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export default styled.div`
  background: #fff;
  display: grid;
  height: 100vh;
  grid-template-columns: 72px 250px 1fr;
  grid-template-rows: auto 1fr auto;
  @media ${devices.tablet} {
    display: flex;
    flex-direction: column;
  }
  @media ${devices.mobileL} {
    display: flex;
    flex-direction: column;
  }
  @media ${devices.mobileM} {
    display: flex;
    flex-direction: column;
  }
  @media ${devices.mobileS} {
    display: flex;
    flex-direction: column;
  }
`;