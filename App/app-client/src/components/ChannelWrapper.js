import styled from 'styled-components'
export const Wrapper = styled.div`
	width: inherit;
	height: inherit;
	grid-column: 2;
	grid-row: 1 / 4;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	border-right: 1px solid rgba(200, 200, 200, 0.5);
	border-left: 1px solid rgba(200, 200, 200, 0.5);
	/* width */
	::-webkit-scrollbar {
		width: 14px;
	}
	/* Track */
	::-webkit-scrollbar-track {
		background-color: #f3f3f3;
		background-clip: padding-box;
		border: 3px solid #fff;
		border-radius: 7px;
	}
	/* Handle */
	::-webkit-scrollbar-thumb {
		background-color: #d3e1ef;
		background-clip: padding-box;
		border: 3px solid #fff;
		border-radius: 7px;
	}
	@media (max-width: 768px) {
		display: none;
		
	}
`;



 const paddingLeft = "padding-left: 20px";
 const paddingRight = "padding-right: 20px";

export const ListItem = styled.li`
	display: flex;
	justify-content: space-between;
	padding: 1.75px;
	${paddingLeft};
	${paddingRight};
	color: #696969;
	font-weight: 500;
	font-size: 15px;
	margin-bottom: 7px;
	&:hover {
		background: #bbcad9;
		color: #696969;
		border-radius: 0;
	}
`;

export const ListHeader = styled.li`
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	font-weight: 600;
	color: #696969;
	text-transform: uppercase;
	${paddingLeft};
	${paddingRight};
`;

export const PushLeft = styled.div`
	${paddingLeft}
`;