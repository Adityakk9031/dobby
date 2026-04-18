export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type DriveBreadcrumb = {
  id: string;
  name: string;
  href: string;
};

export type DriveFolderOption = {
  id: string;
  label: string;
};

export type DriveFolder = {
  id: string;
  name: string;
  childCount: number;
  fileCount: number;
  totalSize: number;
  updatedAt: string;
};

export type DriveAsset = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string | null;
  note: string | null;
  updatedAt: string;
};
