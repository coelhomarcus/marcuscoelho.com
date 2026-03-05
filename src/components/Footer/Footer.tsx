import {
  RxGithubLogo as GithubIcon,
  RxLinkedinLogo as LinkedinIcon,
} from "react-icons/rx";
import { LuMail as MailIcon } from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center border-t border-zinc-700/50 pt-4 mt-4">
      <div className="flex items-center gap-1 text-zinc-500">
        <SocialLink href="mailto:marcusrangelcoelho@gmail.com" label="Email">
          <MailIcon className="size-4" />
        </SocialLink>
        <SocialLink href="https://github.com/coelhomarcus" label="GitHub">
          <GithubIcon className="size-4" />
        </SocialLink>
        <SocialLink
          href="https://www.linkedin.com/in/coelhomarcus/"
          label="LinkedIn"
        >
          <LinkedinIcon className="size-4" />
        </SocialLink>
      </div>
      <span className="text-xs text-zinc-500">
        © {new Date().getFullYear()} Marcus Coelho
      </span>
    </footer>
  );
};

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-1.5 rounded-md hover:text-zinc-100 transition-colors"
    >
      {children}
    </a>
  );
}

export default Footer;
