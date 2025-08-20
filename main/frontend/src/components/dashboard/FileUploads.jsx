import { useState } from "react";

export default function FileUploads({ attachments, setAttachments, onActivity }) {
  const [dragActive, setDragActive] = useState(false);

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleFiles(fileList) {
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result,
          uploadedAt: Date.now(),
          description: "",
        };
        setAttachments(prev => [...prev, attachment]);
        onActivity?.({ action: 'file:upload', target: { type: 'file', id: attachment.id, title: file.name } });
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(id) {
    const file = attachments.find(f => f.id === id);
    setAttachments(prev => prev.filter(f => f.id !== id));
    onActivity?.({ action: 'file:delete', target: { type: 'file', id, title: file?.name } });
  }

  function updateDescription(id, description) {
    setAttachments(prev => prev.map(f => f.id === id ? { ...f, description } : f));
  }

  const totalSize = attachments.reduce((sum, f) => sum + f.size, 0);
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <main className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">File Management</h2>
        <p className="text-gray-600">Upload and organize files for your projects</p>
        <div className="text-sm text-gray-500 mt-2">
          Total files: {attachments.length} • Total size: {formatSize(totalSize)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-4">Upload Files</h3>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-gray-600 mb-4">
              <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-lg">Drag and drop files here</p>
              <p className="text-sm">or click to browse</p>
            </div>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <label htmlFor="file-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
              Choose Files
            </label>
          </div>
        </section>

        <section className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-4">File Library</h3>
          <div className="space-y-3 max-h-96 overflow-auto">
            {attachments.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">
                No files uploaded yet
              </div>
            ) : (
              attachments.map(file => (
                <div key={file.id} className="border rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      className="text-red-600 text-sm ml-2"
                      onClick={() => removeFile(file.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    className="border rounded px-2 py-1 w-full text-sm"
                    placeholder="Add description (optional)"
                    value={file.description}
                    onChange={(e) => updateDescription(file.id, e.target.value)}
                  />
                  {file.type.startsWith('image/') && (
                    <img 
                      src={file.data} 
                      alt={file.name}
                      className="mt-2 max-w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
