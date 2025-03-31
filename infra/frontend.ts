import { api } from "./api";

export const frontend = new sst.aws.Nextjs("MyWeb", {
  link: [api],
  path: "packages/frontend",
});
