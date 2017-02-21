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
function dynamoDBClient() {
  AWS.config.region = "ap-northeast-1";
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: "ap-northeast-1:"});
  AWS.config.credentials.get();
  console.log("Cognito Identify Id: "+AWS.config.credentials.identityId)
  return new AWS.DynamoDB();
}
/*
function wait(){
  console.log(data)
  console.log('API responses has not arrive')
  // this.setState({APIStatus: "Not yet finished, polling again..."})
  if (JSON.stringify(data) == "{}") {
    return
  }
  setTimeout(wait(),1000)
}
*/
class FileUpload extends React.Component {
  constructor() {
    super();
    this.state = {
      uploadStatus: "Waiting for your upload!!",
      APIStatus: "Not yet called",
      imageFiles: [],
      aLabel0: null, aLabel1: null, aLabel2: null,
      aConf0: null, aConf1: null, aConf2: null,
      dLabel0: null, dLabel1: null, dLabel2: null,
      dConf0: null, dConf1: null, dConf2: null,
      gLabel0: null, gLabel1: null, gLabel2: null,
      gConf0: null, gConf1: null, gConf2: null,
      mLabel0: null, mLabel1: null, mLabel2: null,
      mConf0: null, mConf1: null, mConf2: null,
      cLabel0: null, cLabel1: null, cLabel2: null,
      cConf0: null, cConf1: null, cConf2: null,
    };
    this.onDrop = this.onDrop.bind(this); // Important !!!
  }

  onDrop(files){
    this.setState({imageFiles: files})
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
      this.setState({APIStatus: 'Call Start'});
    }).catch((err) => {
      console.log(err)
      this.setState({uploadStatus: 'Upload failed'})
    })

    const dynamodb = dynamoDBClient();
    let params = {
      Key: {"key": {"S":files[0].name}},
      TableName: "stepfunctions-trial"
    };
    let result = dynamodb.getItem(params).promise();
    result.then((data) => {
      /*
      function wait(){
        console.log('API responses has not arrive')
        this.setState({APIStatus: "Not yet finished, polling again..."})
        if (JSON.stringify(data) === '{}') {
          return
        }
        setTimeout(wait(),1000)
      }
      */
      try {
      console.log(data);
      this.setState({APIStatus: "Finished!!!"});
      this.setState({aLabel0: data.Item.amazon.M.Labels.L["0"].M.Name.S});
      this.setState({aConf0: data.Item.amazon.M.Labels.L["0"].M.Confidence.N});
      this.setState({aLabel1: data.Item.amazon.M.Labels.L["1"].M.Name.S});
      this.setState({aConf1: data.Item.amazon.M.Labels.L["1"].M.Confidence.N});
      this.setState({aLabel2: data.Item.amazon.M.Labels.L["2"].M.Name.S});
      this.setState({aConf2: data.Item.amazon.M.Labels.L["2"].M.Confidence.N});
      this.setState({dLabel0: data.Item.docomo.M.candidates.L["0"].M.tag.S});
      this.setState({dConf0: data.Item.docomo.M.candidates.L["0"].M.score.N});
      this.setState({dLabel1: data.Item.docomo.M.candidates.L["1"].M.tag.S});
      this.setState({dConf1: data.Item.docomo.M.candidates.L["1"].M.score.N});
      this.setState({dLabel2: data.Item.docomo.M.candidates.L["2"].M.tag.S});
      this.setState({dConf2: data.Item.docomo.M.candidates.L["2"].M.score.N});
      this.setState({gLabel0: data.Item.google.M.responses.L["0"].M.labelAnnotations.L["0"].M.description.S});
      this.setState({gConf0: data.Item.google.M.responses.L["0"].M.labelAnnotations.L["0"].M.score.N});
      this.setState({gLabel1: data.Item.google.M.responses.L["0"].M.labelAnnotations.L["1"].M.description.S});
      this.setState({gConf1: data.Item.google.M.responses.L["0"].M.labelAnnotations.L["1"].M.score.N});
      this.setState({gLabel2: data.Item.google.M.responses.L["0"].M.labelAnnotations.L["2"].M.description.S});
      this.setState({gConf2: data.Item.google.M.responses.L["0"].M.labelAnnotations.L["2"].M.score.N});
      this.setState({mLabel0: data.Item.microsoft.M.categories.L["0"].M.name.S});
      this.setState({mConf0: data.Item.microsoft.M.categories.L["0"].M.score.N});
      this.setState({mLabel1: data.Item.microsoft.M.categories.L["1"].M.name.S});
      this.setState({mConf1: data.Item.microsoft.M.categories.L["1"].M.score.N});
      this.setState({mLabel2: data.Item.microsoft.M.categories.L["2"].M.name.S});
      this.setState({mConf2: data.Item.microsoft.M.categories.L["2"].M.score.N});
      this.setState({cLabel0: data.Item.microsoft.M.categories.L["0"].M.detail.M.celebrities.L["0"].M.name.S});
      this.setState({cConf0: data.Item.microsoft.M.categories.L["0"].M.detail.M.celebrities.L["0"].M.confidence.N});
      this.setState({cLabel1: data.Item.microsoft.M.categories.L["0"].M.detail.M.celebrities.L["1"].M.name.S});
      this.setState({cConf1: data.Item.microsoft.M.categories.L["0"].M.detail.M.celebrities.L["1"].M.confidence.N});
      this.setState({cLabel2: data.Item.microsoft.M.categories.L["0"].M.detail.M.celebrities.L["2"].M.name.S});
      this.setState({cConf2: data.Item.microsoft.M.categories.L["0"].M.detail.M.celebrities.L["2"].M.confidence.N});
    }catch(err) {}
    }).catch((err) => {
      console.log(err)
      this.setState({uploadStatus: 'Upload failed'})
    })
  }
  render(){
    return (
      <div>
        <Message uploadStatus={this.state.uploadStatus} APIStatus={this.state.APIStatus}/>
        <Dropzone onDrop={this.onDrop} multiple={false}>
          <div>Try dropping a file here, or click to select a file to upload.</div>
          <div>{this.state.imageFiles.map((file) => <img key={this.state.imageFiles} src={file.preview} style={{width: 200}}/> )}</div>
        </Dropzone>
        <Labels
          aLabel0={this.state.aLabel0} aConf0={this.state.aConf0}
          aLabel1={this.state.aLabel1} aConf1={this.state.aConf1}
          aLabel2={this.state.aLabel2} aConf2={this.state.aConf2}
          dLabel0={this.state.dLabel0} dConf0={this.state.dConf0}
          dLabel1={this.state.dLabel1} dConf1={this.state.dConf1}
          dLabel2={this.state.dLabel2} dConf2={this.state.dConf2}
          gLabel0={this.state.gLabel0} gConf0={this.state.gConf0}
          gLabel1={this.state.gLabel1} gConf1={this.state.gConf1}
          gLabel2={this.state.gLabel2} gConf2={this.state.gConf2}
          mLabel0={this.state.mLabel0} mConf0={this.state.mConf0}
          mLabel1={this.state.mLabel1} mConf1={this.state.mConf1}
          mLabel2={this.state.mLabel2} mConf2={this.state.mConf2}
          />
        <Celebs
          cLabel0={this.state.cLabel0} cConf0={this.state.cConf0}
          cLabel1={this.state.cLabel1} cConf1={this.state.cConf1}
          cLabel2={this.state.cLabel2} cConf2={this.state.cConf2}
          />
      </div>
    );
  }
};

class Message extends React.Component {
  render() {
    return(
      <div>
        <p>File Status: {this.props.uploadStatus}</p>
        <p>API Status: {this.props.APIStatus}</p>
      </div>
    );
  }
}

class Labels extends React.Component {
  render() {
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <th colSpan="2">Amazon</th>
              <th colSpan="2">docomo</th>
              <th colSpan="2">Google</th>
              <th colSpan="2">Microsoft</th>
            </tr>
            <tr>
              <td>Label</td><td>Conf</td>
              <td>Label</td><td>Conf</td>
              <td>Label</td><td>Conf</td>
              <td>Label</td><td>Conf</td>
            </tr>
            <tr>
              <td>{this.props.aLabel0}</td><td>{this.props.aConf0}</td>
              <td>{this.props.dLabel0}</td><td>{this.props.dConf0}</td>
              <td>{this.props.gLabel0}</td><td>{this.props.gConf0}</td>
              <td>{this.props.mLabel0}</td><td>{this.props.mConf0}</td>
            </tr>
            <tr>
              <td>{this.props.aLabel1}</td><td>{this.props.aConf1}</td>
              <td>{this.props.dLabel1}</td><td>{this.props.dConf1}</td>
              <td>{this.props.gLabel1}</td><td>{this.props.gConf1}</td>
              <td>{this.props.mLabel1}</td><td>{this.props.mConf1}</td>
            </tr>
            <tr>
              <td>{this.props.aLabel2}</td><td>{this.props.aConf2}</td>
              <td>{this.props.dLabel2}</td><td>{this.props.dConf2}</td>
              <td>{this.props.gLabel2}</td><td>{this.props.gConf2}</td>
              <td>{this.props.mLabel2}</td><td>{this.props.mConf2}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Celebs extends React.Component {
  render() {
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <th colSpan="2">Celebs [MS]</th>
            </tr>
            <tr>
              <td>Label</td><td>Conf</td>
            </tr>
            <tr>
              <td>{this.props.cLabel0}</td><td>{this.props.cConf0}</td>
            </tr>
            <tr>
              <td>{this.props.cLabel1}</td><td>{this.props.cConf1}</td>
            </tr>
            <tr>
              <td>{this.props.cLabel2}</td><td>{this.props.cConf2}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


ReactDOM.render(
  <FileUpload />,
  document.getElementById('container')
);
