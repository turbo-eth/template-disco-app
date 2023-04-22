// enables type definitions on `req.credentials`
declare module 'http' {
  interface IncomingMessage {
    // TODO: add better types here based on properties of Disco's `Credential` type
    credentials: Array<Object>
  }
}
