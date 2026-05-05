import { useRef, useState } from 'react';
import { Bold, Italic, Link, List, ListOrdered, Pilcrow, Quote, Type } from 'lucide-react';
import styles from './RichTextEditor.module.css';

function runCommand(command, value = null) {
  document.execCommand(command, false, value);
}

export function RichTextEditor({
  label,
  name,
  placeholder = 'Write formatted content...',
  required = false,
  rows = 8,
}) {
  const editorRef = useRef(null);
  const [value, setValue] = useState('');

  const syncValue = () => {
    setValue(editorRef.current?.innerHTML || '');
  };

  const applyCommand = (command, commandValue = null) => {
    editorRef.current?.focus();
    runCommand(command, commandValue);
    syncValue();
  };

  const applyLink = () => {
    const href = window.prompt('Enter link URL');
    if (!href) {
      return;
    }
    applyCommand('createLink', href);
  };

  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input name={name} type="hidden" value={value} required={required} />
      <div className={styles.toolbar} aria-label={`${label} formatting toolbar`}>
        <button type="button" onClick={() => applyCommand('formatBlock', 'p')} title="Paragraph">
          <Pilcrow size={16} />
        </button>
        <button type="button" onClick={() => applyCommand('formatBlock', 'h2')} title="Heading">
          <Type size={16} />
        </button>
        <button type="button" onClick={() => applyCommand('bold')} title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => applyCommand('italic')} title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => applyCommand('insertUnorderedList')} title="Bullet list">
          <List size={16} />
        </button>
        <button type="button" onClick={() => applyCommand('insertOrderedList')} title="Numbered list">
          <ListOrdered size={16} />
        </button>
        <button type="button" onClick={() => applyCommand('formatBlock', 'blockquote')} title="Quote">
          <Quote size={16} />
        </button>
        <button type="button" onClick={applyLink} title="Link">
          <Link size={16} />
        </button>
      </div>
      <div
        aria-label={label}
        className={styles.editor}
        contentEditable
        data-placeholder={placeholder}
        onBlur={syncValue}
        onInput={syncValue}
        ref={editorRef}
        role="textbox"
        style={{ minHeight: `${Math.max(rows, 4) * 24}px` }}
        suppressContentEditableWarning
      />
    </label>
  );
}
