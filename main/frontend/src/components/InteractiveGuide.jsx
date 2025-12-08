import { useEffect, useState } from "react";

export default function InteractiveGuide({ contextType, onClose }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const stepsByContext = {
    home: [
      { selector: '#hero', title: 'Welcome to Veltra', text: 'Click Get Started to begin onboarding.' }
    ],
    individual: [
      { selector: '#guide-add-idea', title: 'Add your first idea', text: 'Capture a content idea to populate your workspace.' },
    ],
    team: [
      { selector: '#guide-invite', title: 'Invite your first teammate', text: 'Bring your team on board to collaborate.' },
      { selector: '#guide-first-task', title: 'Create your first task', text: 'Assign a task to kick off your workflow!.' },
    ]
  };

  const steps = stepsByContext[contextType] || stepsByContext.home;
  const current = steps[step];

  const target = current ? document.querySelector(current.selector) : null;
  const rect = target ? target.getBoundingClientRect() : null;

  return (
    <div className="fixed inset-0  pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Tooltip */}
      {rect && (
        <div
          className="absolute bg-white rounded shadow-xl p-4 w-72 pointer-events-auto z-70"
          style={{ top: Math.max(16, rect.bottom + window.scrollY + 8), left: Math.min(window.innerWidth - 300, rect.left + window.scrollX) }}
        >
          <div className="font-semibold mb-1">{current.title}</div>
          <div className="text-sm text-gray-600 mb-3">{current.text}</div>
          <div className="flex justify-between items-center">
            <button className="text-sm" onClick={onClose}>Skip</button>
            <div className="flex gap-2">
              {step > 0 && (
                <button className="border px-3 py-1 rounded" onClick={() => setStep(s => s - 1)}>Back</button>
              )}
              {step < steps.length - 1 ? (
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setStep(s => s + 1)}>Next</button>
              ) : (
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={onClose}>Finish</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Highlight target */}
      {rect && (
        <div
          className="absolute border-2 border-blue-500 rounded pointer-events-none"
          style={{
            top: rect.top + window.scrollY - 6,
            left: rect.left + window.scrollX - 6,
            width: rect.width + 12,
            height: rect.height + 12
          }}
        />
      )}
    </div>
  );
}



