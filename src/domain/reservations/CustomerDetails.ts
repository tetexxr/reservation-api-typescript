export class CustomerDetails {
  constructor(
    private readonly name: string,
    private readonly email: string,
    private readonly phoneNumber: string
  ) {}

  getName(): string {
    return this.name
  }

  getEmail(): string {
    return this.email
  }

  getPhoneNumber(): string {
    return this.phoneNumber
  }
}
