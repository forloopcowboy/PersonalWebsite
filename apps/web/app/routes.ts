import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/locale-redirect.tsx"),
  route(":locale", "routes/$locale.tsx", [
    index("routes/home.tsx"),
    route("contact", "routes/contact.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/:slug", "routes/project.$slug.tsx"),
  ]),
] satisfies RouteConfig;
