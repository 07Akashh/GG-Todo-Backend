"use strict";
const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");
//========================== Load internal modules ====================
const config = require("../config").cfg;
const appUtils = require("../utils/appUtils");
//========================== Load Modules End ==============================================

const blobServiceClient = new AWS.S3({
  accessKeyId: config.SES_CONFIG.accessKeyId,
  secretAccessKey: config.SES_CONFIG.secretAccessKey,
  region: config.SES_CONFIG.region,
});

// S3 Bucket name - configurable via environment variable
const BUCKET_NAME = process.env.S3_BUCKET_NAME || "ggtodo-files";

const __deleteTempFile = (filePath) => {
  fs.stat(filePath, (err, _stats) => {
    if (err) {
      appUtils.logError({
        moduleName: "uploadDeleteToBlob",
        methodName: "__deleteTempFile",
        err,
      });
    }
    fs.unlink(filePath, (_err) => {
      if (_err) {
        console.log(_err);
        appUtils.logError({
          moduleName: "uploadDeleteToBlob",
          methodName: "__deleteTempFile",
          err: _err,
        });
      }
      console.log("file deleted successfully");
    });
  });
};

const __uploadToBlob = async (file, fileKey) => {
  try {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: fileStream,
    };

    const data = await blobServiceClient.upload(params).promise();

    console.log({
      message: "File uploaded successfully",
      filename: fileKey,
      location: data.Location,
    });
    return data;
  } catch (err) {
    appUtils.logError({
      moduleName: "uploadDeleteToBlob",
      methodName: "__uploadToBlob",
      err,
    });
    throw err;
  }
};

function uploadFile(file, fileKey) {
  return __uploadToBlob(file, fileKey)
    .then((data) => {
      __deleteTempFile(file.path);
      return data;
    })
    .catch(function (_err) {
      appUtils.logError({
        moduleName: "uploadDeleteToBlob",
        methodName: "uploadFile",
        err: _err,
      });
      __deleteTempFile(file.path);
    });
}

function deleteFromS3(fileKey) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };

  blobServiceClient.deleteObject(params, (err, data) => {
    if (err) {
      appUtils.logError({
        moduleName: "uploadDeleteToBlob",
        methodName: "deleteFromS3",
        err,
      });
      return false;
    } else {
      console.log("delete success: ", data, fileKey);
      return true;
    }
  });
  return true;
}

//========================== Export Module Start ==============================

module.exports = {
  uploadFile,
  __deleteTempFile,
  deleteFromS3,
  BUCKET_NAME,
};

//========================== Export Module End ===============================
