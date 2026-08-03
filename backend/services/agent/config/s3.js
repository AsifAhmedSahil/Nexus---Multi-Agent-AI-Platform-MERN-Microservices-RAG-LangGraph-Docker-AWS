

import {S3Client} from "@aws-sdk/client-s3"

export const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_KEY 
    },
    // Only calculate checksums when explicitly required. Newer AWS SDK v3
    // versions add `x-amz-checksum-mode=ENABLED` to presigned GET URLs by
    // default, which can make the URL fail in the browser (image won't load).
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED"
})
