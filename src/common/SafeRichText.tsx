import {
  RichText as JssRichText,
  RichTextField,
} from "@sitecore-jss/sitecore-jss-nextjs";
import { fixMediaUrls } from "lib/utils";
import { useMemo } from "react";

interface SafeRichTextProps {
  field?: RichTextField;
  [key: string]: any;
}

/**
 * A wrapper around Sitecore's RichText component that fixes media URLs
 * by replacing incorrect hostnames with relative paths
 */
export default function SafeRichText({ field, tag, ...props }: SafeRichTextProps) {
  const fixedField = useMemo(() => {
    if (!field?.value) return field;

    const value = field.value as string;
    const fixedValue = fixMediaUrls(value);

    return {
      ...field,
      value: fixedValue,
    };
  }, [field]);

  // If tag is an inline element (e.g. "p", "span") but the content contains
  // block-level elements (<div>, <p>, <ul>, etc.), switch to "div" to avoid
  // invalid HTML nesting which causes hydration errors.
  const inlineTags = ["p", "span", "a", "label"];
  const hasBlockContent = /<(div|p|ul|ol|li|section|article|blockquote|h[1-6]|table|form|fieldset|header|footer|nav|main|aside|figure|figcaption|details|summary|pre|hr|br\/?>[\s]*<br)\b/i.test(
    (field?.value as string) || ""
  );
  const safeTag = tag && inlineTags.includes(tag) && hasBlockContent ? "div" : tag;

  return (
    <div className="font-loew">
      <JssRichText field={fixedField} tag={safeTag} {...props} />
    </div>
  );
}
