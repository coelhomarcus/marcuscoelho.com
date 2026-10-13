import { SocialLink, socialLinks } from "@/components/SocialLink/SocialLink";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center border-t border-zinc-700/50 pt-4 mt-4">
      <div className="flex items-center gap-1 text-zinc-500">
        {socialLinks.map((link) => (
          <SocialLink key={link.label} {...link} />
        ))}
      </div>
      <span className="text-xs text-zinc-500">
        © {new Date().getFullYear()} Marcus Coelho
      </span>
    </footer>
  );
};

export default Footer;
