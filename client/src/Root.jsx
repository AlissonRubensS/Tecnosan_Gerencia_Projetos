import { StrictMode, useState } from "react";
import { selectedProjectContext } from "./components/Content/SeletedProject.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router.jsx";

function Root() {
  const [currentProject, setCurrentProject] = useState(null);
  return (
    <StrictMode>
      <selectedProjectContext.Provider
        value={{ currentProject, setCurrentProject }}
      >
        <RouterProvider 
          router={router} 
          future={{
            v7_startTransition: true,
          }}
        />
      </selectedProjectContext.Provider>
    </StrictMode>
  );
}

export default Root;