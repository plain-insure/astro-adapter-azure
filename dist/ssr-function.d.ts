import type { SSRManifest } from "astro";
import type { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
export declare const createExports: (manifest: SSRManifest) => {
    default: (integrationConfig: {
        notFoundContent?: string;
    }) => (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;
};
