export interface Book {
  id: string;
  title: string;
  author: string;
  series: string;
  year: number;
  description: string;
  isReleased: boolean;
  /** Release timing is unknown; `year` is only a rough estimate used for ordering. */
  tbd?: boolean;
  recommendedOrderSeq?: number;
  goodreadsRating?: number;
  cosmere?: boolean;
  seriesNumber?: number;
  subSeries?: string;
  lengthType?: string;
  links: {
    amazon?: string;
    audible?: string;
    coppermind?: string;
    goodreads?: string;
  }
}

export type UserBookStatus = 'read' | 'tbr' | null;

export interface UserData {
  bookStatuses: Record<string, UserBookStatus>;
}
