import styles from "../styles/Sections.module.sass";
import Image from "next/image";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import AddProjectDialog from "./AddProjectDialog";
import fw from "../../lib/FetchWrapper";
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
    <div id="home" className="w-full">
      <div className="pb-10 w-full flex flex-col justify-center items-center">
        <div className="flex justify-center items-center">
          <h1>Projects</h1>
          <div className="ml-10">
            <Button caption="+ Add" onClick={showAddProjectDialog} />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center pt-10">
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
