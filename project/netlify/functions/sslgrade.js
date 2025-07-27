

export async function handler(event, context) {
    const host = event.queryStringParameters.host;
    if (!host) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing host parameter" }),
        };
    }

    // Only allow public domains (not localhost or private IPs)
    if (
        host === "localhost" ||
        /^127\\./.test(host) ||
        /^192\\.168\\./.test(host) ||
        /^10\\./.test(host) ||
        /^172\\.(1[6-9]|2[0-9]|3[0-1])\\./.test(host)
    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "SSL Labs only supports public domains." }),
        };
    }

    const apiUrl = `https://api.ssllabs.com/api/v3/analyze?publish=off&fromCache=on&all=done&host=${encodeURIComponent(host)}`;
    try {
        const resp = await fetch(apiUrl);
        const data = await resp.json();
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
}