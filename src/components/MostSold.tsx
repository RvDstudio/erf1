// src\app\page.tsx
'use client';
import { Eye, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cardsData } from '@/constants/constants';

export default function MostSold() {
  return (
    <div className="w-full">
      <div className="grid items-center justify-items-center gap-16">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {cardsData.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Card className="overflow-hidden rounded-3xl group cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative h-64 bg-[#E97F5A] overflow-hidden">
                      <Badge className="absolute bottom-6 right-4 z-20 bg-erf1-500  text-white text-xs rounded-full px-2.5 py-1">
                        {card.badge}
                      </Badge>
                      <div className="relative h-full w-full">
                        <Image
                          src={card.image}
                          alt={card.alt}
                          className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                          fill
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 bg-white border-none">
                    <div className="relative">
                      <Avatar className="absolute z-60 -bottom-2 left-2 border-2 border-white bg-white">
                        <AvatarImage src={card.avatar} alt="Author avatar" />
                        <AvatarFallback>{card.fallback}</AvatarFallback>
                      </Avatar>
                    </div>
                    <h5 className="text-lg mt-6 mb-0 group-hover:text-primary line-clamp-2">{card.title}</h5>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <Badge
                        variant="secondary"
                        className="flex h-fit w-fit items-center font-medium bg-muted dark:bg-darkmuted text-dark dark:text-white p-1 text-xs rounded-full px-2.5 py-1 mt-6"
                      >
                        {card.category}
                      </Badge>
                      <div className="flex gap-0.5 items-center justify-center pt-6">
                        {[...Array(3)].map((_, starIndex) => (
                          <svg key={starIndex} className="h- w-5 shrink-0 fill-amber-400" viewBox="0 0 256 256">
                            <path d="M239.2 97.4A16.4 16.4.0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4.0 00128 16h0a16.4 16.4.0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5.0 0016.8 97.4 16.8 16.8.0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5.0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1.0 008.7 2.6 16.5 16.5.0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8.0 00239.2 97.4z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{card.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{card.comments}</span>
                        </div>
                      </div>
                      <div>{card.date}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
