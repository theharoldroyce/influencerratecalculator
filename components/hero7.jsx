import { Star } from "lucide-react";
import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Hero7 = ({
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",

  button = {
    text: "Discover all components",
    url: "https://www.shadcnblocks.com",
  },

  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
        alt: "Avatar 1",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
        alt: "Avatar 2",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
        alt: "Avatar 3",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
        alt: "Avatar 4",
      },
      {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
        alt: "Avatar 5",
      },
    ],
  }
}) => {
  return (
    <section className="flex items-center justify-center py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container px-4 text-center sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 sm:gap-5 md:max-w-4xl md:gap-6">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
            {heading}
          </h1>
          <p className="text-muted-foreground text-balance text-base sm:text-lg md:text-xl">
            {description}
          </p>
        </div>
        <Button asChild size="lg" className="mt-8 sm:mt-10">
          <a href={button.url}>{button.text}</a>
        </Button>
        <div className="mx-auto mt-8 flex w-fit flex-col items-center gap-4 sm:mt-10 sm:flex-row">
          <span className="inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-12 border-2 border-background sm:size-14">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-1 sm:justify-start">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-1 font-semibold">
                {reviews.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium sm:text-base">
              from {reviews.count}+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero7 };
