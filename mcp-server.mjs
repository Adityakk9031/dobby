#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await loadLocalEnv();

const db = new PrismaClient({
  log: ["error"],
});

const server = new McpServer({
  name: "dobby-drive-mcp",
  version: "1.0.0",
});

const createFolderInput = {
  user_email: z.string().email().describe("Email of the Dobby Drive user who owns the folder tree."),
  name: z.string().min(1).max(80).describe("Name of the folder to create."),
  parent_folder_id: z.string().optional().describe("Optional folder id to create inside."),
  parent_path: z
    .string()
    .optional()
    .describe("Optional folder path like 'Projects/2026'. Use either parent_folder_id or parent_path."),
};

const uploadImageInput = {
  user_email: z.string().email().describe("Email of the Dobby Drive user who owns the upload."),
  name: z.string().min(1).max(120).describe("Display name for the image inside Dobby Drive."),
  source_path: z
    .string()
    .min(1)
    .describe("Absolute or project-relative local path to an image file on disk."),
  folder_id: z.string().optional().describe("Optional destination folder id."),
  folder_path: z
    .string()
    .optional()
    .describe("Optional destination folder path like 'Projects/Campaigns'. Use either folder_id or folder_path."),
};

server.registerTool(
  "list_folders",
  {
    title: "List folders",
    description:
      "List the user's folders with ids and full paths. Use this before create_folder or upload_image when you need exact folder ids.",
    inputSchema: {
      user_email: z.string().email().describe("Email of the Dobby Drive user."),
    },
  },
  async ({ user_email }) => {
    const user = await getUserByEmail(user_email);
    const folders = await getFolderSummaries(user.id);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(folders, null, 2),
        },
      ],
      structuredContent: {
        folders,
      },
    };
  },
);

server.registerTool(
  "create_folder",
  {
    title: "Create folder",
    description:
      "Create a folder for a specific Dobby Drive user. Supports root folders or nested folders by id or path.",
    inputSchema: createFolderInput,
  },
  async ({ user_email, name, parent_folder_id, parent_path }) => {
    ensureExclusiveTarget(parent_folder_id, parent_path, "parent_folder_id", "parent_path");

    const user = await getUserByEmail(user_email);
    const parentFolder = await resolveFolderTarget(user.id, {
      folderId: parent_folder_id ?? null,
      folderPath: parent_path ?? null,
    });

    const folder = await createFolderForOwner(user.id, name, parentFolder?.id ?? null);
    const folderPath = await buildFolderPath(folder.id);

    return {
      content: [
        {
          type: "text",
          text: `Created folder "${folder.name}" at "${folderPath}".`,
        },
      ],
      structuredContent: {
        folder: {
          id: folder.id,
          name: folder.name,
          path: folderPath,
          parentId: parentFolder?.id ?? null,
        },
      },
    };
  },
);

server.registerTool(
  "upload_image",
  {
    title: "Upload image",
    description:
      "Upload a local image file into Dobby Drive for a specific user and place it in a chosen folder or in the root.",
    inputSchema: uploadImageInput,
  },
  async ({ user_email, name, source_path, folder_id, folder_path }) => {
    ensureExclusiveTarget(folder_id, folder_path, "folder_id", "folder_path");

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing.");
    }

    const user = await getUserByEmail(user_email);
    const destinationFolder = await resolveFolderTarget(user.id, {
      folderId: folder_id ?? null,
      folderPath: folder_path ?? null,
    });

    const resolvedSourcePath = path.isAbsolute(source_path)
      ? source_path
      : path.resolve(__dirname, source_path);

    const fileInfo = await stat(resolvedSourcePath);
    if (!fileInfo.isFile()) {
      throw new Error(`Source path is not a file: ${resolvedSourcePath}`);
    }

    const fileBuffer = await readFile(resolvedSourcePath);
    const contentType = getImageMimeType(resolvedSourcePath);
    if (!contentType) {
      throw new Error("Only .png, .jpg, .jpeg, .webp, .gif, .svg, .avif, and .bmp files are supported.");
    }

    const safeBaseName = slugify(name) || "image";
    const originalName = path.basename(resolvedSourcePath).replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const blob = await put(`users/${user.id}/${Date.now()}-${safeBaseName}-${originalName}`, fileBuffer, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });

    const file = await db.driveFile.create({
      data: {
        ownerId: user.id,
        folderId: destinationFolder?.id ?? null,
        name,
        type: contentType,
        size: fileBuffer.byteLength,
        url: blob.url,
        note: null,
      },
      select: {
        id: true,
        name: true,
        size: true,
        url: true,
        folderId: true,
      },
    });

    const folderLabel = destinationFolder ? await buildFolderPath(destinationFolder.id) : "Root";

    return {
      content: [
        {
          type: "text",
          text: `Uploaded "${file.name}" to ${folderLabel}.`,
        },
      ],
      structuredContent: {
        image: {
          id: file.id,
          name: file.name,
          size: file.size,
          url: file.url,
          folderId: file.folderId,
          folderPath: folderLabel,
        },
      },
    };
  },
);

async function getUserByEmail(email) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error(`No Dobby Drive user exists with email "${email}".`);
  }

  return user;
}

async function resolveFolderTarget(ownerId, { folderId, folderPath }) {
  if (folderId) {
    const folder = await db.folder.findFirst({
      where: {
        id: folderId,
        ownerId,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });

    if (!folder) {
      throw new Error(`Folder id "${folderId}" was not found for this user.`);
    }

    return folder;
  }

  if (!folderPath) {
    return null;
  }

  const parts = folderPath
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return null;
  }

  let parentId = null;
  let folder = null;

  for (const part of parts) {
    folder = await db.folder.findFirst({
      where: {
        ownerId,
        parentId,
        name: part,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!folder) {
      throw new Error(`Folder path segment "${part}" was not found under "${parts.join("/")}".`);
    }

    parentId = folder.id;
  }

  return folder;
}

async function createFolderForOwner(ownerId, name, parentId) {
  const baseSlug = slugify(name) || "folder";
  let slug = baseSlug;
  let counter = 1;

  while (
    await db.folder.findFirst({
      where: {
        ownerId,
        parentId,
        slug,
      },
      select: {
        id: true,
      },
    })
  ) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return db.folder.create({
    data: {
      ownerId,
      parentId,
      name,
      slug,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

async function buildFolderPath(folderId) {
  const parts = [];
  let cursorId = folderId;

  while (cursorId) {
    const folder = await db.folder.findUnique({
      where: {
        id: cursorId,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });

    if (!folder) {
      break;
    }

    parts.unshift(folder.name);
    cursorId = folder.parentId;
  }

  return parts.join(" / ");
}

async function getFolderSummaries(ownerId) {
  const [folders, files] = await Promise.all([
    db.folder.findMany({
      where: {
        ownerId,
      },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        name: true,
        parentId: true,
        updatedAt: true,
      },
    }),
    db.driveFile.findMany({
      where: {
        ownerId,
      },
      select: {
        folderId: true,
        size: true,
      },
    }),
  ]);

  const folderMap = new Map(
    folders.map((folder) => [
      folder.id,
      {
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        updatedAt: folder.updatedAt.toISOString(),
      },
    ]),
  );
  const childMap = new Map();
  const directSizeMap = new Map();

  for (const folder of folders) {
    const items = childMap.get(folder.parentId) ?? [];
    items.push(folder.id);
    childMap.set(folder.parentId, items);
  }

  for (const file of files) {
    directSizeMap.set(file.folderId, (directSizeMap.get(file.folderId) ?? 0) + file.size);
  }

  const sizeMemo = new Map();
  const pathMemo = new Map();

  function getPath(id) {
    if (pathMemo.has(id)) {
      return pathMemo.get(id);
    }

    const folder = folderMap.get(id);
    if (!folder) {
      return "";
    }

    const label = folder.parentId ? `${getPath(folder.parentId)} / ${folder.name}` : folder.name;
    pathMemo.set(id, label);
    return label;
  }

  function getSize(id) {
    if (sizeMemo.has(id)) {
      return sizeMemo.get(id);
    }

    const own = directSizeMap.get(id) ?? 0;
    const nested = (childMap.get(id) ?? []).reduce((sum, childId) => sum + getSize(childId), 0);
    const total = own + nested;
    sizeMemo.set(id, total);
    return total;
  }

  return folders
    .map((folder) => ({
      id: folder.id,
      name: folder.name,
      path: getPath(folder.id),
      parentId: folder.parentId,
      totalSizeBytes: getSize(folder.id),
      updatedAt: folder.updatedAt.toISOString(),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function ensureExclusiveTarget(idValue, pathValue, idLabel, pathLabel) {
  if (idValue && pathValue) {
    throw new Error(`Use either ${idLabel} or ${pathLabel}, not both.`);
  }
}

function getImageMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    case ".bmp":
      return "image/bmp";
    default:
      return null;
  }
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function loadLocalEnv() {
  for (const fileName of [".env", ".env.local"]) {
    const filePath = path.join(__dirname, fileName);

    try {
      const source = await readFile(filePath, "utf8");
      for (const line of source.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          continue;
        }

        const separatorIndex = trimmed.indexOf("=");
        if (separatorIndex === -1) {
          continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();

        if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } catch {
      // Ignore missing local env files so Claude Desktop can also provide env values directly.
    }
  }
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Dobby Drive MCP server running on stdio");
}

main().catch(async (error) => {
  console.error("MCP server error:", error);
  await db.$disconnect();
  process.exit(1);
});

process.on("SIGINT", async () => {
  await db.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await db.$disconnect();
  process.exit(0);
});
