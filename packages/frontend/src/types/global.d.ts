export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      keyId?: string
    }
  }
}