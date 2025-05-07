import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { ExternalLink } from "lucide-react";

export type ProjectType = {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  type: "image" | "video";
  videoId?: string;
};

export const ProjectCard = ({ project }: { project: ProjectType }) => {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {project.type === "image" ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={`https://www.youtube.com/embed/${project.videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="mb-2 text-xl font-bold tracking-tight">
            {project.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="absolute right-4 top-4 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <ExternalLink className="h-4 w-4 text-foreground" />
      </div>
    </motion.a>
  );
};
