import styles from "../styles/Sections.module.sass";
import Image from "next/image";
import Button from "./Button";
import { useEffect, useState } from "react";
import AddProjectDialog from "./AddProjectDialog";
import fw from "../lib/FetchWrapper";
import ProjectItem, {ItemProps} from "./ProjectItem";

const ProjectsPage = () => {
  const [addProjectDialogVisible, setAddProjectDialogVisible] = useState(false);
  const [projects, setProjects] = useState(Array<ItemProps>());

  const showAddProjectDialog = () => {
    setAddProjectDialogVisible(true);
  };

  const fetchProjects = () => {
    fw.get("/v1/projects").then(({ result }) => {
      console.log("🚀 ~ file: ProjectsPage.tsx ~ line 49 ~ fetchProjects ~ result", result);
      setProjects(result);
    })
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div id="home" className="w-auto">
      <div className="pb-10 w-auto flex flex-col justify-center items-left">
        <div className="flex justify-center items-center">
          <h1>Projects</h1>
          <div className="ml-10">
            <Button caption="+ Add" onClick={showAddProjectDialog} />
          </div>
        </div>

        <div className="flex items-left w-full">
        <div>Total {projects.length} project(s)</div>
        </div>

        <div className="flex flex-wrap justify-center items-center pt-10">
          {projects.map((project) => (
            <ProjectItem item={project} onClick={()=>{}} key={project._id}/>
          ))}
        </div>
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
