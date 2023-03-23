export class ResponseBuilder {
    private statusCode: number = 200;
    private body: object = {};
  
    setStatusCode(statusCode: number) {
      this.statusCode = statusCode;
      return this;
    }
  
    setBody(body: object) {
      this.body = body;
      return this;
    }
  
    build() {
      return {
        statusCode: this.statusCode,
        body: JSON.stringify(this.body, null, 4),
      };
    }
}