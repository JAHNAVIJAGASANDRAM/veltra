import React from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatsOverview from "../components/dashboard/StatsOverview";
import RecentActivity from "../components/dashboard/RecentActivity";
import TaskList from "../components/dashboard/TaskList";

function DashboardPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Topbar />
        <div className="p-6">
          <StatsOverview />
          <RecentActivity />
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
