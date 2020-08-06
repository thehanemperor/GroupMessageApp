import styled from "styled-components";

export default styled.div`
  grid-column: 3;
  grid-row: 2;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  font-size: 15px !important;
  background-color: #fff;
  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #f3f3f3;
    background-clip: padding-box;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #d3e1ef;
    background-clip: padding-box;
  }
  @media (max-width: 768px) {
    flex-grow: 1;
    padding: 0;
  }
`;