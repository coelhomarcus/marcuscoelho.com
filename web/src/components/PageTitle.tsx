import { useEffect } from "react";

interface PageTitleProps {
  title: string;
  suffix?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, suffix }) => {
   useEffect(() => {
      const originalTitle = document.title;
      if (suffix) {
         document.title = title + " |  Marcus Coelho"
      } else {
         document.title = title;
      }


      return () => {
         document.title = originalTitle;
      };
   }, [title, suffix]);

   return null;
};

export default PageTitle;
