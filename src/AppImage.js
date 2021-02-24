import React from 'react';
import Amplify, { Storage } from 'aws-amplify';
import { PhotoPicker } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import { result } from 'lodash';

const AWS = require('aws-sdk');
const bucket = awsconfig.aws_user_files_s3_bucket;

const region = awsconfig.aws_project_region;

Amplify.configure(awsconfig);
AWS.config.update({region: 'eu-west-2'});

const rek = new AWS.Rekognition();

class AppImage extends React.Component {
    state = {
        file: {}
    }

    onChange(data) {
        this.setState({ file: data.file })
    }

    saveFile = async () => {
        const { file } = this.state
        Storage.put(file.name, file) // upload to s3
        .then ( result => {
            checkImage(file.name)
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <h2><center><PhotoPicker
                    preview
                    onPick={data => this.onChange(data)}
                /></center></h2>
                <center>
                    <button onClick={this.saveFile}>Upload image
                    </button>
                </center>s
            </div>
        )
    }
}

let checkImage = (filename) => {
    var params = {
        Image: {
          S3Object: {
            Bucket: bucket,
            Name: `public/${filename}`,
          },
        },
        "MinConfidence": 80,
    }

    return new Promise((resolve, reject) => {
        rek.detectModerationLabels(params, (err, data) => {
            if (err) {
                console.log(err)
                return reject(new Error(err));
            }
            connsole.log(JSON.stringify(data));
        });
    });
    
}