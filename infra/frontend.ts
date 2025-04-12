import { api } from "./api";
import { clerkClientPublishableKey, clerkClientSecretKey, secrets } from "./secrets";

export const frontend = new sst.aws.Nextjs("MyWeb", {
  link: [api, secrets],
  path: "packages/frontend",
  environment: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkClientPublishableKey.value,
    CLERK_SECRET_KEY: clerkClientSecretKey.value,
  },
});
