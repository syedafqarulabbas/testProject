import { useEffect, useState } from "react";
import { useSitecoreContext } from "@sitecore-jss/sitecore-jss-nextjs";
const useExperienceEditor = () => {
  const { sitecoreContext }: any = useSitecoreContext();
  const [inExperienceEditor, set_inExperienceEditor] = useState<null | boolean>(
    null,
  );
  useEffect(() => {
    const isPageEditor = sitecoreContext?.pageEditing;
    set_inExperienceEditor(isPageEditor);
  }, []);

  return inExperienceEditor;
};

export default useExperienceEditor;
