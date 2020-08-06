import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

import { Icon,Popup } from 'semantic-ui-react'

const TeamWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #fff;
  color: #d9cfd9;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-y: auto;
  /* width */
  ::-webkit-scrollbar {
    width: 14px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #696969;
    background-clip: padding-box;
    border: 3px solid #fff;
    border-radius: 7px;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #696969;
    background-clip: padding-box;
    border: 3px solid #fff;
    border-radius: 7px;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const popStyle = {
  marginLeft: "4rem",
  height: "36px",
  display: "flex",
  // justifyContent: "center",
  // alignItems: "center"
};

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    padding-top: 0;
    margin-bottom: 10px;
  }
`;

const ListItem = styled.li`
  height: 46px;
  width: 46px;
  background-color: #696969;
  color: #fff;
  /*margin: auto;*/
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Helvetica Neue, sans-serif;
  font-size: 20px;
  font-weight: 500;
  border-radius: 50%;
  transition: all 0.3s ease-out;
  &:hover {
    border-radius: 10px;
    background: #39B9F9;
    color: #fff;
    cursor: pointer;
  }
`;

const Back = styled.div`
  color: #fff;
  display: block;
  margin-bottom: 50%;
  transform: translate(0, -50%);
  font-size: 20px;
  @media (max-width: 768px) {
    margin-bottom: 0;
    font-size: 1.5rem;
    margin-right: 20px;
  }
`;

const team =  ({id,letter,name})=>
    <div key={`team-${id}`} style={{
      width: "36px",
      height: "36px",
      marginBottom: "20px",
    }}>
    <Link  to={`/view-team/${id}`}>
        <Popup
        style={popStyle}
        trigger={<ListItem>{letter}</ListItem>}
        content={
          <div
            style={{
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            {name}
          </div>
        }
        basic
        position="right center"
        inverted
      />
    </Link>
        {/* <Link  to={`/view-team/${id}`}>
        <TeamListItem >{letter}</TeamListItem>
        
        </Link> */}
    </div>


export default ({
    teams
}) =>(
    <TeamWrapper>
        <TeamList>
            {teams.map(team)}
            <Link key={`add-team`} to={`/create-team`}>
                <div  style={{
                width: "36px",
                height: "36px",
                marginBottom: "20px",
                }}>
                <ListItem style={{ background: "#39B9F9", color: "#fff" }}>+</ListItem>
                </div>
            </Link>
        </TeamList>
        <Link
            key="home"
            to={`/`}
            style={{ marginTop: "50px", marginBottom: "20px", display: "block" }}
            >
            <Back>
                <Icon style={{ color: "#000" }} name="home" />
            </Back>
        </Link>
    </TeamWrapper>
)