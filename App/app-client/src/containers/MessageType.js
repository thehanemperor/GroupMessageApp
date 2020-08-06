import React from 'react'
import {Comment} from 'semantic-ui-react'

const TextMessage = ({ url }) => {
  return <div> </div> ;
};
const ImageMessage = ({ url }) => {
  return (
    <img
      style={{
        borderRadius: "5px",
        marginTop: "20px",
        boxShadow: "1px 1px 6px 1px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "inherit",
        maxWidth: "350px",
        padding: "10px",
      }}
      width="350px"
      src={url}
      alt={url}
    />
  );
};
const AudioMessage = ({ url, filetype }) => {
  return (
    <div>
      <audio controls>
        <source src={url} type={filetype} />
      </audio>
    </div>
  );
};

const VideoMessage = ({ url, filetype }) => {
  return (
    <div>
      <video width="420" height="240" controls>
        <source src={url} type={filetype} />
      </video>
    </div>
  );
};
const NormalMessage = ({ text }) => {
  return (
    <Comment.Text
      style={{
        fontWeight: "300",
        fontSize: "16px",
        fontFamily: "AvenirNext, sans-serif",
      }}
    >
      {text}
    </Comment.Text>
  );
};

export  { NormalMessage, VideoMessage,AudioMessage, ImageMessage, TextMessage }