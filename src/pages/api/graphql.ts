import type { NextApiRequest, NextApiResponse } from "next";
import config from "temp/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = `${config.graphQLEndpoint}?sc_apikey=${config.sitecoreApiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error("GraphQL proxy error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
