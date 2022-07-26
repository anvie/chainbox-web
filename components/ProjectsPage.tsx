import styles from "../styles/Sections.module.sass";
import Image from "next/image";
import Button from "./Button";
import { useEffect, useState } from "react";
import AddProjectDialog from "./AddProjectDialog";
import fw from "../lib/FetchWrapper";
import ProjectItem, { ItemProps } from "./ProjectItem";
import { userAccess } from "../lib/UserAccess";

const ProjectsPage = () => {
  const [addProjectDialogVisible, setAddProjectDialogVisible] = useState(false);
  const [projects, setProjects] = useState(Array<ItemProps>());

  const showAddProjectDialog = () => {
    setAddProjectDialogVisible(true);
  };
  const hideAddProjectDialog = () => {
    setAddProjectDialogVisible(false);
  };

  const fetchProjects = () => {
    fw.get("/v1/projects")
      .then(({ result }) => {
        console.log(
          "🚀 ~ file: ProjectsPage.tsx ~ line 49 ~ fetchProjects ~ result",
          result
        );
        setProjects(result);
      })
      .catch((err: any) => {
        console.log("[ERROR]", err);
      });
  };

  useEffect(() => {
    fetchProjects();

    const subs = userAccess.access?.subscribe((access: any) => {
      if (access) {
        fetchProjects();
      }
    });

    return () => {
      subs?.unsubscribe();
    };
  }, []);

  return (
    <div id="home" className="w-full">
      <div className="pb-10 w-auto flex flex-col justify-center items-left">
        <div className="flex items-center">
          <h1>{addProjectDialogVisible ? 'Add new Project' : 'Projects'}</h1>
          <div className="ml-10">
            {!addProjectDialogVisible && (
              <Button caption="+ Add" onClick={showAddProjectDialog} />
            )}
            {addProjectDialogVisible && (
              <Button caption="Cancel" onClick={hideAddProjectDialog} />
            )}
          </div>
        </div>

        {!addProjectDialogVisible && (<div className="flex items-left w-full">
          <div>Total {projects.length} project(s)</div>
        </div>)}

        {!addProjectDialogVisible && (
          <div className="flex flex-wrap justify-center items-center pt-10">
            {projects.map((project) => (
              <ProjectItem
                item={project}
                onClick={() => {}}
                key={project._id}
              />
            ))}
          </div>
        )}
      </div>

      {addProjectDialogVisible && (
        <AddProjectDialog
          show={addProjectDialogVisible}
          onClose={() => setAddProjectDialogVisible(false)}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
