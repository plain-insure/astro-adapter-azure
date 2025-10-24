import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { applyPolyfills } from "astro/app/node";
import type { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";

applyPolyfills();

export const createExports = (manifest: SSRManifest) => {
  const app = new App(manifest);

  function createHandler(integrationConfig: { notFoundContent?: string }) {
    // Azure Functions v4 programming model handler signature: (request, context) => Promise<HttpResponseInit>
    return async function handler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
      try {
        // Convert Azure Functions HttpRequest to standard Request for Astro
        const url = request.url;
        const method = request.method;
        
        // Create headers object from Azure Functions request
        const headers = new Headers();
        if (request.headers) {
          for (const [key, value] of Object.entries(request.headers)) {
            if (typeof value === 'string') {
              headers.set(key, value);
            } else if (Array.isArray(value)) {
              // Handle multiple header values
              value.forEach(v => headers.append(key, v));
            }
          }
        }

        // Get body for the standard Request
        let body: BodyInit | null = null;
        if (method !== 'GET' && method !== 'HEAD') {
          if (request.body) {
            body = await request.arrayBuffer();
          }
        }

        // Create standard Request object for Astro
        const astroRequest = new Request(url, {
          method,
          headers,
          body
        });

        const routeData = app.match(astroRequest);
        if (
          !routeData &&
          typeof integrationConfig.notFoundContent !== "undefined"
        ) {
          return {
            status: 404,
            headers: { "Content-Type": "text/html; charset=utf-8" },
            body: integrationConfig.notFoundContent
          };
        }

        const response = await app.render(astroRequest, { routeData });

        // Convert standard Response to Azure Functions v4 HttpResponseInit
        const responseBody = await response.text();
        const responseHeaders: Record<string, string> = {};
        
        response.headers.forEach((value: string, key: string) => {
          responseHeaders[key] = value;
        });

        return {
          status: response.status,
          headers: responseHeaders,
          body: responseBody
        };
      } catch (error) {
        context.error('Error processing request:', error);
        return {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8" },
          body: "Internal Server Error"
        };
      }
    };
  }

  return { default: createHandler };
};
