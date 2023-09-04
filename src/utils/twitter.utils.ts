import { createHmac } from "crypto";
import _ from "lodash";

function generateOAuthSignature(
    method: string,
    url: string,
    params: Record<string, string>,
    consumerSecret: string,
    tokenSecret: string
): string {
    const baseString = buildBaseString(method, url, params);
    const signingKey = `${encodeURIComponent(
        consumerSecret
    )}&${encodeURIComponent(tokenSecret)}`;
    const signature = createHmac("sha1", signingKey)
        .update(baseString)
        .digest("base64");
    return signature;
}

function buildBaseString(
    method: string,
    url: string,
    params: Record<string, string>
): string {
    const sortedParams = Object.keys(params)
        .sort()
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    params[key as string] as string
                )}`
        )
        .join("&");

    const encodedUrl = encodeURIComponent(url);

    return `${method.toUpperCase()}&${encodedUrl}&${encodeURIComponent(
        sortedParams
    )}`;
}

export const getTwitterAuthHeader = (method: string, url: string) => {
    const params = {
        oauth_consumer_key: process.env["CONSUMER_KEY"] ?? "",
        oauth_token: process.env["ACCESS_TOKEN"] ?? "",
        oauth_callback: process.env["TOKEN_SECRET"] ?? "",
        oauth_nonce: _.times(20, () => _.random(35).toString(36)).join(""),
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_signature_method: "HMAC-SHA1",
        oauth_version: "1.0",
    };

    const consumerSecret = process.env["CONSUMER_SECRET"] ?? "";
    const tokenSecret = process.env["TOKEN_SECRET"] ?? "";

    console.log({ params });

    const oauth_signature = generateOAuthSignature(
        method,
        url,
        params,
        consumerSecret,
        tokenSecret
    );

    return `OAuth oauth_consumer_key="${params.oauth_consumer_key}", oauth_token="${params.oauth_token}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${params.oauth_timestamp}", oauth_nonce="${params.oauth_nonce}", oauth_version="1.0", oauth_callback="${params.oauth_callback}", oauth_signature="${oauth_signature}"`;
};
