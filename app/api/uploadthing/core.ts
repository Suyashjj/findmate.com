import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Profile image uploaded:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
  
  documents: f({ pdf: { maxFileSize: "16MB", maxFileCount: 3 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Document uploaded:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;