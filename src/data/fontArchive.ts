export type FontArchiveCollection = {
  id: string;
  name: string;
  description: string;
};

export type FontArchiveFamily = {
  id: string;
  displayName: string;
  collections: string[];
  historicalClassification: string | null;
  relationshipClassification: string;
  fileIds: string[];
  faceIds: string[];
};

export type FontArchiveFile = {
  id: string;
  filename: string;
  relativePath: string;
  sourceCategory: string;
  format: string;
  sha256: string;
  duplicateGroupId: string | null;
  licensingStatus: string;
  faceIds: string[];
};

export type FontArchiveFace = {
  id: string;
  familyId: string;
  metadataFamily: string;
  style: string;
  fullName: string;
  postScriptName: string;
  faceIndex: number;
  namedInstanceIndex: number;
  fileId: string;
};

export type FontArchiveData = {
  sourceScanRecordCount: number;
  collections: FontArchiveCollection[];
  families: FontArchiveFamily[];
  files: FontArchiveFile[];
  faces: FontArchiveFace[];
};
