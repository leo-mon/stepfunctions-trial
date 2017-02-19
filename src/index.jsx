import React from 'react';
import ReactDOM from 'react-dom'
import Dropzone from 'react-dropzone';
import 'aws-sdk/dist/aws-sdk';
const AWS = window.AWS;

function s3Client() {
  AWS.config.region = "ap-northeast-1";
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: "ap-northeast-1:"});
  AWS.config.credentials.get();
  console.log("Cognito Identify Id: "+AWS.config.credentials.identityId)
  return new AWS.S3({params: {Bucket: "step-functions-trial"}});
}

class FileUpload extends React.Component {
  constructor() {
    super();
    this.state = {
      uploadStatus: "Waiting Upload"
    };
    this.onDrop = this.onDrop.bind(this); // Important !!!
  }

  onDrop(files){
    this.setState({uploadStatus: "Uploading..."});
    const s3 = s3Client();
    //console.log(files);
    //console.log(s3);
    const putObjectPromise = s3.putObject({
      Key: files[0].name,
      ContentType: files[0].type,
      Body: files[0],
      ACL: "public-read"
    }).promise()
    putObjectPromise.then((data) => {
      console.log('Success');
      this.setState({uploadStatus: 'Upload succeeded'});
    }).catch((err) => {
      console.log(err)
      this.setState({uploadStatus: 'Upload failed'})
    })
  }

  render(){
    return (
      <div>
        <Dropzone onDrop={this.onDrop} multiple={false}>
          <div>Try dropping a file here, or click to select a file to upload.</div>
        </Dropzone>
        <Message uploadStatus={this.state.uploadStatus}/>
      </div>
    );
  }
};

class Message extends React.Component {
  render() {
    return(
      <div>{this.props.uploadStatus}</div>
    );
  }
}

ReactDOM.render(
  <FileUpload />,
  document.getElementById('container')
);
