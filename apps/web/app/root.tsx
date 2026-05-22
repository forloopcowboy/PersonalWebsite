import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
} from "react-router";
import { faviconUrl, logo192Url } from "@personal/ui";
import appStylesUrl from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesUrl },
  { rel: "icon", href: faviconUrl, type: "image/x-icon" },
  { rel: "apple-touch-icon", href: logo192Url },
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
