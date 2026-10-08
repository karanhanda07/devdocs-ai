import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const storage = new S3Client({
    region: process.env.B2_REGION,
    endpoint: process.env.B2_ENDPOINT,

    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY,
    },

    //  Only send AWS checksums when the operation requires them.
    // This improves compatibility with Backblaze B2.
    requestChecksumCalculation: "WHEN_REQUIRED",

    //Only validate response checksums when required.
    responseChecksumValidation: "WHEN_REQUIRED",
});

export default storage;