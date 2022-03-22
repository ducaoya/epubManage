const S3 = require("aws-sdk/clients/s3");

const accessKeyId = "jwmek5jdevkkwdzvdjwasgfbfllq";
const secretAccessKey = "jzlhvukkomy5az2gpjgpim4q26nmtlb4lxe55a3oosqe44j75vno2";
const endpoint = "https://gateway.ap1.storjshare.io";

const s3 = new S3({
    accessKeyId,
    secretAccessKey,
    endpoint,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
    connectTimeout: 0,
    httpOptions: { timeout: 0 },
});

async function downloadUrl(name) {
    const myBucket = "wss-ebook";
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

async function putUrl(name) {
    const myBucket = "wss-ebook";
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

async function delS3(name) {
    const myBucket = "wss-ebook";
    const myKey = name; //文件名，1.epub

    const results = s3.deleteObject({
            Bucket: myBucket,
            Key: myKey,
        },
        (error, data) => {
            if (error) {
                console.error("删除失败", error);
            } else {
                console.log("删除成功", data);
            }
        }
    );
    return results;
}

module.exports = {
    downloadUrl,
    putUrl,
    delS3,
};