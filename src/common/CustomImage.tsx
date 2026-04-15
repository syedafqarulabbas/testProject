import { Image } from "@sitecore-jss/sitecore-jss-nextjs";

export default function CustomImage({ field, className, isLCP = false }: any) {
  const loadingAttr = isLCP ? "eager" : "lazy";

  return (
    <Image
      field={field}
      className={className}
      loading={loadingAttr}
      priority={isLCP ? "true" : undefined}
      fetchPriority={isLCP ? "high" : undefined}
    />
  );
}
