import { useState } from "react";
import ActivityFeed from "./ActivityFeed";

export default function TeamCollaboration({ team, activity }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), text: text.trim(), ts: Date.now(), author: "you" }]);
    setText("");
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="bg-white rounded shadow p-4 lg:col-span-2">
        <h2 className="font-semibold mb-2">Team Chat (Demo)</h2>
        <div className="border rounded h-64 p-3 overflow-auto mb-3 bg-gray-50">
          {messages.map(m => (
            <div key={m.id} className="text-sm mb-2"><span className="font-semibold">{m.author}:</span> {m.text}</div>
          ))}
          {messages.length === 0 && <div className="text-gray-500 text-sm">No messages yet.</div>}
        </div>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Type a message" value={text} onChange={e => setText(e.target.value)} />
          <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={send}>Send</button>
        </div>
        <div className="text-xs text-gray-600 mt-2">Tip: Integrate with Slack/Discord in Settings.</div>
      </section>
      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Members</h2>
        <div className="space-y-2">
          {team?.members?.map(m => (
            <div key={m.email} className="border rounded p-2 text-sm">{m.email} — {m.role}</div>
          ))}
          {(!team?.members || team.members.length === 0) && <div className="text-gray-500 text-sm">No members listed.</div>}
        </div>
      </section>
      <section className="bg-white rounded shadow p-4 lg:col-span-3">
        <h2 className="font-semibold mb-2">Activity Feed</h2>
        <ActivityFeed items={activity} />
      </section>
    </main>
  );
}


