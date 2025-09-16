import React from "react";
import ContentEditor from "../components/Content/ContentEditor";
import ContentList from "../components/Content/ContentList";
import ContentCalendar from "../components/Content/ContentCalendar";
import ApprovalBoard from "../components/Content/ApprovalBoard";

function ContentPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Content Hub</h1>
      <ContentEditor />
      <ContentList />
      <ContentCalendar />
      <ApprovalBoard />
    </div>
  );
}

export default ContentPage;
