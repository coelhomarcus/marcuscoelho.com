import { Link, NavLink } from "react-router";
import { motion } from "motion/react";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";

import Sidebar from "@/components/layout/sidebar/sidebar";

import { SocialLink } from "@/components/social-link";
import FluidOrb from "@/components/ui/fluid-orb";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { navigation, socials } from "@/data/navigation";

const Header = () => {
  return (
    <header className="flex justify-between items-center pt-4 pb-2">
      <Link
        to="/"
        className="text-zinc-100 font-medium text-sm hover:opacity-80 transition-opacity flex items-center rounded-sm"
      >
        {/* Decorative: the link already reads "Marcus Coelho" */}
        <FluidOrb size={20} aria-hidden className="mr-2 shrink-0" />
        Marcus Coelho
      </Link>

      <nav className="hidden @xl:inline-flex h-8 w-fit items-center justify-center rounded-lg bg-black p-[3px] text-muted-foreground ring-1 ring-white/10">
        {navigation.map((item) => (
          <HeaderLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <div className="hidden @2xl:flex items-center gap-1 text-zinc-500">
          {socials.map((link) => (
            <SocialLink key={link.name} {...link} />
          ))}
        </div>
        <Sidebar />
      </div>
    </header>
  );
};

function HeaderLink({ href, name, icon: Icon }: NavItem) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <NavLink
      to={href}
      {...hoverProps}
      className={({ isActive }) =>
        cn(
          "relative inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md border border-transparent pr-2.5 pl-2 py-0.5 text-sm font-medium whitespace-nowrap transition-colors",
          isActive ? "text-black" : "text-foreground/60 hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* One shared pill slides between tabs instead of cross-fading two */}
          {isActive && (
            <motion.span
              layoutId="header-active-tab"
              className="absolute inset-0 bg-zinc-100"
              style={{ borderRadius: 8 }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          <span className="relative z-10 inline-flex items-center gap-1.5">
            <Icon ref={ref} size={14} />
            {name}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default Header;
