import { useMemo, useState } from "react";

export default function CommentThread({ targetType, targetId, comments, setComments, team }) {
  const [text, setText] = useState("");

  const list = useMemo(() => comments.filter(c => c.targetType === targetType && c.targetId === targetId), [comments, targetType, targetId]);

  function addComment() {
    if (!text.trim()) return;
    const mentions = (text.match(/@[^\s,]+/g) || []).map(s => s.slice(1));
    const comment = {
      id: crypto.randomUUID(),
      targetType,
      targetId,
      author: "you",
      body: text.trim(),
      mentions,
      ts: Date.now(),
    };
    setComments(prev => [
      ...prev,
      comment
    ]);
    setText("");
  }

  return (
    <div className="border-t pt-2 mt-2">
      <div className="space-y-2 max-h-40 overflow-auto">
        {list.map(c => (
          <div key={c.id} className="text-sm">
            <span className="font-medium">{c.author}</span>: {c.body}
          </div>
        ))}
        {list.length === 0 && <div className="text-xs text-gray-500">No comments yet.</div>}
      </div>
      <div className="mt-2 flex gap-2">
        <input className="border rounded px-2 py-1 flex-1 text-sm" placeholder="Write a comment… use @mentions" value={text} onChange={e => setText(e.target.value)} />
        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded" onClick={addComment}>Comment</button>
      </div>
      {team?.members?.length > 0 && (
        <div className="text-[11px] text-gray-500 mt-1">Tip: mention teammates like @{team.members[0].email.split('@')[0]}</div>
      )}
    </div>
  );
}


