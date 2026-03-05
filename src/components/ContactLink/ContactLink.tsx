import type { ContactLinkProps } from "@/types";

const ContactLink = ({ Icon, title, href, ...props }: ContactLinkProps) => {
   return (
      <a
         href={href}
         className="inline-flex items-center gap-1 font-medium text-sm transition-colors hover:text-blue-500"
         {...props}
      >
         <Icon className="size-4" />
         {title}
      </a>
   );
};

export default ContactLink;
