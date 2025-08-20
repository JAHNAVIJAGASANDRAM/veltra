import { useState } from "react";

export default function CustomWorkflowBuilder({ workflows, setWorkflows, onActivity }) {
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newStageName, setNewStageName] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  function createWorkflow() {
    if (!newWorkflowName.trim()) return;
    const workflow = {
      id: crypto.randomUUID(),
      name: newWorkflowName.trim(),
      stages: ["Draft", "Review", "Approved"],
      description: "",
      createdAt: Date.now(),
    };
    setWorkflows(prev => [...prev, workflow]);
    setNewWorkflowName("");
    onActivity?.({ action: 'workflow:create', target: { type: 'workflow', id: workflow.id, title: workflow.name } });
  }

  function addStage(workflowId) {
    if (!newStageName.trim()) return;
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, stages: [...w.stages, newStageName.trim()] }
        : w
    ));
    setNewStageName("");
    onActivity?.({ action: 'workflow:stage:add', target: { type: 'workflow', id: workflowId }, metadata: { stage: newStageName.trim() } });
  }

  function removeStage(workflowId, stageIndex) {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, stages: w.stages.filter((_, i) => i !== stageIndex) }
        : w
    ));
    onActivity?.({ action: 'workflow:stage:remove', target: { type: 'workflow', id: workflowId } });
  }

  function deleteWorkflow(id) {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    onActivity?.({ action: 'workflow:delete', target: { type: 'workflow', id } });
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-4">Create New Workflow</h2>
        <div className="space-y-3">
          <input 
            className="border rounded px-3 py-2 w-full" 
            placeholder="Workflow name (e.g., Content Publishing)" 
            value={newWorkflowName} 
            onChange={e => setNewWorkflowName(e.target.value)} 
          />
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded w-full" 
            onClick={createWorkflow}
          >
            Create Workflow
          </button>
        </div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-4">Your Workflows</h2>
        <div className="space-y-3">
          {workflows.map(w => (
            <div key={w.id} className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{w.name}</h3>
                <button 
                  className="text-sm text-red-600" 
                  onClick={() => deleteWorkflow(w.id)}
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Stages: {w.stages.join(" → ")}
              </div>
              <div className="flex gap-2">
                <input 
                  className="border rounded px-2 py-1 flex-1 text-sm" 
                  placeholder="Add stage" 
                  value={newStageName} 
                  onChange={e => setNewStageName(e.target.value)} 
                />
                <button 
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded" 
                  onClick={() => addStage(w.id)}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {w.stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                    <span>{stage}</span>
                    {w.stages.length > 1 && (
                      <button 
                        className="text-red-500 text-xs" 
                        onClick={() => removeStage(w.id, index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {workflows.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-4">
              No custom workflows yet. Create your first one!
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
