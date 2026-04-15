import React from "react";
import { Router, withRouter } from "next/router";

type Props = {
  href: string;
  children: React.ReactNode;
  router: Router;
  className?: string;
  title?: string;
  target?: string;
};

class LinkNoPrefetch extends React.PureComponent<Props> {
  normalizeHref = (href: string) => {
    return href.startsWith("/en") ? href.replace(/^\/en/, "") || "/" : href;
  };

  onClick = async (event: React.MouseEvent) => {
    const { router, href } = this.props;
    event.preventDefault();
    const normalizedHref = this.normalizeHref(href);
    await router.push(normalizedHref);
  };

  render() {
    const {
      href,
      children,
      className = "",
      title = "",
      target = "",
    } = this.props;
    const normalizedHref = this.normalizeHref(href);
    return (
      <>
        {target !== "" && target === "_blank" ? (
          <a
            href={normalizedHref}
            title={title}
            target={target}
            rel="noopener noreferrer"
            className={`${className} LinkNoPrefetch`}
          >
            {children}
          </a>
        ) : (
          <a
            href={normalizedHref}
            title={title}
            onClick={this.onClick}
            className={`${className} LinkNoPrefetch`}
          >
            {children}
          </a>
        )}
      </>
    );
  }
}

export default withRouter(LinkNoPrefetch);
