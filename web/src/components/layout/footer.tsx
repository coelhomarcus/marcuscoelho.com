import { SocialLink } from "@/components/social-link";
import { socials } from "@/data/navigation";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center">
      <div className="flex items-center gap-1 text-zinc-500">
        {socials.map((link) => (
          <SocialLink key={link.name} {...link} />
        ))}
      </div>
      <span className="text-xs text-zinc-500">
        © {new Date().getFullYear()} Marcus Coelho
      </span>
    </footer>
  );
};

export default Footer;
