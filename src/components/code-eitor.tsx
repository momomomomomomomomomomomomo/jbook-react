import "bulmaswatch/superhero/bulmaswatch.min.css";
import "./code-editor.css";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef } from "react";
interface CodeEditorProps {
  inititalValue: string;
  onChange: (value: string) => void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, inititalValue }) => {
  const editorRef = useRef<any>();
  const onEditorDidMount: EditorDidMount = (getValue, editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    editor.getModel()?.updateOptions({ tabSize: 2 });
  };
  const onFormatClick = () => {
    //get current value from editor
    const unformatted = editorRef.current.getModel().getValue();

    //format the value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: true,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");
    //set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };
  return (
    <div className="editor-wrapper">
      <button
        className="button is-primary is-small button-format"
        onClick={onFormatClick}
      >
        Format
      </button>

      <MonacoEditor
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        editorDidMount={onEditorDidMount}
        value={inititalValue}
        theme="dark"
        language="javascript"
        height="500px"
      />
    </div>
  );
};
export default CodeEditor;
