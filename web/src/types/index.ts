export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'READER' | 'AUTHOR' | 'EDITOR' | 'ADMIN';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: string;
  key: string;
  name: string;
  description?: string;
  avatar?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'ORG' | 'SPACE' | 'PRIVATE';
  publishedAt?: string;
  authorId: string;
  spaceId?: string;
  featuredImage?: string;
  author: User;
  space?: Space;
  tags: Tag[];
  invitees: User[];
  _count: {
    claps: number;
    comments: number;
    views: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  status: 'ACTIVE' | 'HIDDEN' | 'FLAGGED';
  authorId: string;
  postId: string;
  parentId?: string;
  author: User;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PostVersion {
  id: string;
  postId: string;
  title: string;
  content: string;
  version: number;
  createdAt: string;
}

export interface Clap {
  id: string;
  userId: string;
  postId: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface View {
  id: string;
  userId?: string;
  postId: string;
  ipAddress?: string;
  userAgent?: string;
  viewedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  postId?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'VIEW' | 'CLAP' | 'BOOKMARK' | 'COMMENT';
  resourceType: string;
  resourceId: string;
  actorId: string;
  actorEmail: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  prevHash?: string;
  hash: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: {
    message: string;
    details?: any;
    statusCode: number;
  };
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationMeta;
}

export interface CreatePostData {
  title: string;
  excerpt?: string;
  content: string;
  visibility: 'ORG' | 'SPACE' | 'PRIVATE';
  spaceId?: string;
  featuredImage?: string;
  tags?: string[];
  inviteeEmails?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SearchFilters {
  page?: number;
  limit?: number;
  status?: string;
  visibility?: string;
  spaceId?: string;
  authorId?: string;
  tag?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
