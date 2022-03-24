const S3 = require("aws-sdk/clients/s3");

const accessKeyId = "0042b46e26dbce90000000001";
const secretAccessKey = "K004DROHPyJw+FLwmZ/38tHibk0ZlZM";
const endpoint = "https://s3.us-west-004.backblazeb2.com";

const s3 = new S3({
    accessKeyId,
    secretAccessKey,
    endpoint,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
    connectTimeout: 0,
    httpOptions: { timeout: 0 },
});

async function downloadImgUrl(name) {
    const myBucket = "wss-ebook-image";
    const myKey = name; //文件名，1.epub
    const signedUrlExpireSeconds = 60 * 60 * 24;

    const url = s3.getSignedUrl("getObject", {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds,
    });
    console.log(url);
    return url;
}

async function putImgUrl(name) {
    const myBucket = "wss-ebook-image";
    const myKey = name; //文件名，1.epub
    const signedUrlExpireSeconds = 60 * 60 * 24 * 7;

    const url = s3.getSignedUrl("putObject", {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds,
        ContentType: "application/octet-stream",
    });
    console.log(url);
    return url;
}

module.exports = {
    downloadImgUrl,
    putImgUrl,
};