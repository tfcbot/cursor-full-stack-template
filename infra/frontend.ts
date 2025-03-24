import { bucket } from "./storage";

export const frontend = new sst.aws.Nextjs("MyWeb", {
  path: "packages/frontend",
  link: [bucket],
});
