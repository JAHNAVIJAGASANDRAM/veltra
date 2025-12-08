import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardPage from "./DashboardPage";

export default function WorkspaceRouter() {
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const res = await api.get("/workspace/me");
        setWorkspaceData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    loadWorkspace();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <DashboardPage workspaceData={workspaceData} />;
}
