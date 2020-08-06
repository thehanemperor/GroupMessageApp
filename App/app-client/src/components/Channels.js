import React from 'react'
//import styled from 'styled-components'
import {  Icon , Dropdown, List, Button } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import { Wrapper,ListHeader,PushLeft,ListItem, } from './ChannelWrapper'
import AddCircleImage from '../image/add_cycle.png'


const channel =  ({id,name},teamId)=> 
      <Link to={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
        <ListItem >
            <div
            style={{
              
              fontSize: "16px"
            }}
          >{`#${name}`}
          </div>
        </ListItem>
        
       </Link>

const dmChannel = ({id,name},teamId) => (
    
      <Link 
        key={`user-${id}`} 
        to={`/view-team/${teamId}/${id}`}
        style ={{ color: "black" }}
        ><ListItem>
				<div
					style={{
						 
              fontSize: "16px"
					}}
				>
					{name}
				</div>
			</ListItem>
      </Link>  
     )

export default ({
      teamName, 
      userName,
      channels, 
      dmChannels, 
      isOwner, 
      onAddChannelClick,
      teamId, 
      onInvitePeopleClick,
      onDirectMessageClick
 }) =>(
	 
      <Wrapper>
        <div
			style={{
				
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				fontSize: "20px",
				fontWeight: "500",
				background: "#39b9f9",
				height: "50px",
				position: "relative",
				borderBottom:
					"1px solid rgba(200, 200, 200, 0.5)"
			}}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						overflow: "hidden",
						whiteSpace: "nowrap"
					}}
				>
					<div
						style={{
							marginLeft:
								"20px",
							
							fontWeight:
								"900",
							color:
								"#fff",
							overflow:
								"hidden",
							whiteSpace:
								"nowrap",
							textOverflow:
								"ellipsis"
						}}
					>
							{teamName}
						</div>
					</div>
					<Dropdown
						pointing="top right"
						style={{
							right: "20px",
							position: "absolute",
							zIndex: "2",
							color: "#fff"
						}}
					>
						<Dropdown.Menu>
							<Dropdown.Item>
								<h4>
									Name:{" "}
									<span
										style={{
											backgroundColor:
												"#696969",
											padding:
												"5px 6px 3px 6px",
											borderRadius:
												"10px",
											color:
												"#FFFAF0"
										}}
									>
										{
											teamName
										}
									</span>
								</h4>
							</Dropdown.Item>
							<Dropdown.Item>
								<Icon name="connectdevelop" />{" "}
								Connect with
								others
							</Dropdown.Item>
							<Dropdown.Item>
								<Icon name="add user" />{" "}
								Invite others
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>

        <div>
					<List animated verticalAlign="middle">
						<ListHeader
							style={{
								marginTop:
									"1rem",
								marginBottom:
									".4rem"
							}}
						>
							<div
								style={{
									display:
										"flex",
									justifyContent:
										"space-between",
									width:
										"100%"
								}}
							>
								All Channels{" "}
								{isOwner && (
									<Button
										onClick={
											onAddChannelClick
										}
										style={{
											padding: 0,
											background:
												"none"
										}}
									>
										<img
											alt=""
											src={
												AddCircleImage
											}
											width="15px"
										/>
									</Button>
								)}
							</div>
						</ListHeader>
						{channels
							? channels.map(c =>
									channel(
										c,
										teamId,
									)
							  )
							: null}
					</List>
				</div>

        <div>
					<List animated verticalAlign="middle">
						<ListHeader
							style={{
								marginTop:
									"2rem",
								marginBottom:
									"1rem"
							}}
						>
							<div
								style={{
									display:
										"flex",
									justifyContent:
										"space-between",
									width:
										"100%"
								}}
							>
								Direct Messages{" "}
								<Button
									onClick={
										onDirectMessageClick
									}
									style={{
										padding: 0,
										background:
											"none"
									}}
								>
									<img
										alt=""
										src={
											AddCircleImage
										}
										width="15px"
									/>
								</Button>
							</div>
						</ListHeader>
						{dmChannels.map(dmc =>
							dmChannel(
								dmc,
								teamId,
							)
						)}
					</List>
				</div>
        {isOwner && (
					<PushLeft style={{ marginTop: "2rem" }}>
						<a
							style={{
								color: "#000",
								fontWeight:
									"700",
								background:
									"#fff",
								padding:
									".5rem 1rem",
								borderRadius:
									"5px",
								border:
									"2px solid #000"
							}}
							href="#invite-people"
							onClick={
								onInvitePeopleClick
							}
						>
							+ Invite People
						</a>
					</PushLeft>
				)}
		
		{/* <Image
			src={`https://api.adorable.io/avatars/40/${userName}@adorable.io`}
			style={{
				borderRadius: "50%",
				margin: "5px",
			}}
		/>
				<div
				className="me-info"
				style={{
					flexGrow: "1",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-start",
					height: "100%",
					padding: "8px",
					fontFamily: "sans-serif",
					fontSize: "16px",
					fontWeight: "bolder",
					paddingLeft: "7px",
					color: "#000",
					zIndex: 2,
				}}
				>
				{userName}
				<span
					style={{
					fontSize: "13px",
					fontWeight: "lighter",
					color: "#000",
					}}
				>
					#000
				</span>
				</div>
				<div style={{ marginTop: "10px" }}>
				<Icon
					name="volume up"
					style={{ marginRight: "10px" }}
					color="black"
				/>
				<Icon name="microphone" color="black" />
				</div> */}
    </Wrapper> 
	)




