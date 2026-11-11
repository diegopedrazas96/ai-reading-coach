import { Check } from 'lucide-react';
import type { Passage } from '@/types';

interface PassagePickerProps {
  passages: readonly Passage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function PassagePicker({ passages, selectedIndex, onSelect }: PassagePickerProps) {
  return (
    <div className="passage-picker">
      {passages.map((passage, index) => {
        const selected = index === selectedIndex;
        return (
          <button
            key={passage.id}
            className={selected ? 'selected' : ''}
            onClick={() => onSelect(index)}
          >
            <span>{passage.emoji}</span>
            <span>
              <strong>{passage.title}</strong>
              <small>{passage.tag}</small>
            </span>
            {selected && <Check size={18} />}
          </button>
        );
      })}
    </div>
  );
}
