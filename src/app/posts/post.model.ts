export interface Post {
    id ?: string|null;
    title: string;
    content: string;
    image ?: File | string| null;
    creator ?: string;
}