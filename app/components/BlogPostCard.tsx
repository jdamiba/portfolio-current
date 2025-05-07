import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

export type BlogPostType = {
  title: string;
  description: string;
  link: string;
  tags: string[];
};

export const BlogPostCard = ({ post }: { post: BlogPostType }) => {
  return (
    <motion.a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="mb-2 text-xl font-bold tracking-tight">{post.title}</h3>
      <p className="mb-4 flex-1 text-sm text-muted-foreground">
        {post.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.a>
  );
};
