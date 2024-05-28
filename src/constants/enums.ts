export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum Role {
  Admin,
  User
}

export enum MediaType {
  Image,
  Video
}

export enum AppointmentType {
  Camping,
  Restaurant,
  Villa,
  Other
}

export enum AppointmentStatus {
  Camping,
  Restaurant,
  Villa,
  Other
}

export enum ParticipantInvitationStatus {
  Waiting,
  Accepted
}
