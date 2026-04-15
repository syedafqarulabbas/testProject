import { Link } from "@sitecore-jss/sitecore-jss-nextjs";
import LinkNoPrefetch from "./LinkNoPrefetch";
import useExperienceEditor from "src/hooks/useExperienceEditor";

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
    <path d="M17 14v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3" />
  </svg>
);

interface LinkProps {
  id?: any;
  field?: any;
  children?: React.ReactNode | null;
  preIcon?: React.ReactNode | null;
  postIcon?: React.ReactNode | null;
  className?: string;
  labelClassName?: string;
  type?: "primary" | "secondary";
  width?: "full" | "fit" | "mobileFull";
  uppercase?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  rest?: any;
}

/** Keep for future extensibility */

const WIDTHS: Record<string, string> = {
  full: "w-full",
  fit: "w-fit",
  mobileFull: "w-full lg:w-fit",
};

const CustomLink = ({
  id,
  field,
  children,
  className = "",
  labelClassName = "",
  type = "primary",
  uppercase = false,
  preIcon = null,
  postIcon = null,
  onClick,
  ...rest
}: LinkProps) => {
  const inExperienceEditor = useExperienceEditor();

  const styles = `
    ${uppercase ? "uppercase" : ""}
    ${className}
  `;

  const isExternal = field?.value?.linktype === "external";
  const resolvedPreIcon = isExternal ? (preIcon ?? <ExternalLinkIcon />) : preIcon;

  const content = (
    <>
      {resolvedPreIcon && <span className="rtl:scale-x-[-1]">{resolvedPreIcon}</span>}

      <span id={id} className={`flex-1 text-center ${labelClassName}`}>
        {children ?? field?.value?.text ?? field?.text}
      </span>

      {(!isExternal && postIcon) && <span className="rtl:scale-x-[-1]">{postIcon}</span>}
    </>
  );

  // string href (pdf or direct link)
  if (typeof field === "string") {
    const isPdf = field.toLowerCase().includes(".pdf");
    return (
      <LinkNoPrefetch
        href={field}
        className={className}
        target={isPdf ? "_blank" : undefined}
        {...rest}
      >
        {content}
      </LinkNoPrefetch>
    );
  }

  // external Sitecore link
  if (field?.value?.linktype === "external" || field?.linkType === "external") {
    return (
      <Link
        id={id}
        field={field}
        rel="nofollow"
        target="_blank"
        className={styles}
        aria-label={field?.value?.alt || field?.value?.text}
        title={field?.value?.text}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  // internal / EE-aware logic
  return inExperienceEditor ? (
    <Link
      id={id}
      field={field}
      prefetch={false}
      target={field?.value?.target}
      className={styles}
      aria-label={field?.value?.alt || field?.value?.text}
      title={field?.value?.text}
      {...rest}
    >
      {content}
    </Link>
  ) : field?.value?.href || field?.href ? (
    <LinkNoPrefetch
      href={field?.value?.href || field?.href}
      target={field?.value?.target}
      className={styles}
      title={field?.value?.text}
    >
      {content}
    </LinkNoPrefetch>
  ) : (
    <Link
      id={id}
      field={field}
      prefetch={false}
      target={field?.value?.target}
      className={styles}
      aria-label={field?.value?.alt || field?.value?.text}
      title={field?.value?.text}
      {...rest}
    >
      {content}
    </Link>
  );
};

export default CustomLink;
