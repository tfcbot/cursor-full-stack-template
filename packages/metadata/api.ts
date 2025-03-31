import { z } from "zod";



export const GetRemainingCreditsBodySchema = z.object({
    credits: z.number(),
});

export const StripeCheckoutSessionSchema = z.object({
    url: z.string(),
    sessionId: z.string(),
});

export const StripeBillingPortalSessionSchema = z.object({
    url: z.string(),
});

export const ApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.unknown(),
    error: z.string().optional(),
});

export const UserRemainingCreditsResponseBodySchema = z.object({
    remainingCredits: z.number(),
});


export const OnboardingDTO = z.object({
    onboardingComplete: z.boolean(),
    onboardingDetails: z.any(),
});



export type UserRemainingCreditsResponseBody = z.infer<typeof UserRemainingCreditsResponseBodySchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type GetRemainingCreditsBody = z.infer<typeof GetRemainingCreditsBodySchema>;
export type StripeCheckoutSession = z.infer<typeof StripeCheckoutSessionSchema>;
export type StripeBillingPortalSession = z.infer<typeof StripeBillingPortalSessionSchema>;
export type OnboardingDTO = z.infer<typeof OnboardingDTO>;




