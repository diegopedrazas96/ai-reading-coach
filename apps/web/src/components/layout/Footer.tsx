import { Cloud, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <span>
        Made with <Heart size={14} fill="currentColor" /> for young readers
      </span>
      <span>
        <Cloud size={15} /> Learning prototype • Not a clinical reading assessment
      </span>
    </footer>
  );
}
