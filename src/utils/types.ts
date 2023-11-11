// Define the types
export type List<T> = T[];

export type PackageName = string;

export type SemverRange = string;

export type AuthenticationToken = string;

export type EnumerateOffset = string;

export type RegEx = string;

export type User = {
  name: string;
  isAdmin: boolean;
};

export type UserAuthenticationInfo = {
  password: string;
};

export type PackageID = string;

export type PackageData = {
  Content?: string;
  URL?: string;
  JSProgram?: string;
};

export type PackageRating = {
  BusFactor: number;
  Correctness: number;
  RampUp: number;
  ResponsiveMaintainer: number;
  LicenseScore: number;
  GoodPinningPractice: number;
  PullRequest: number;
  NetScore: number;
};

export type PackageMetadata = {
  Name: PackageName;
  Version: string;
  ID: PackageID;
};

export type PackageHistoryEntry = {
  User: User;
  Date: string; // ISO-8601 datetime string
  PackageMetadata: PackageMetadata;
  Action: 'CREATE' | 'UPDATE' | 'DOWNLOAD' | 'RATE';
};

export type AuthenticationRequest = {
  User: User;
  Secret: UserAuthenticationInfo;
};

export type PackageQuery = {
  Version: SemverRange;
  Name: PackageName;
};

export type PackageRegEx = {
  RegEx: RegEx;
};

export type Package = {
  metadata: PackageMetadata;
  data: PackageData;
};

// Example usage
const user: User = {
  name: 'Alfalfa',
  isAdmin: true,
};

const packageMetadata: PackageMetadata = {
  Name: 'my-package',
  Version: '1.2.3',
  ID: '123567192081501',
};

const packageData: PackageData = {
  Content: 'base64encodedcontent',
};
