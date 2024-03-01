import { SerializedEditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

const PlaceHolder = () => (
  <div style={{ pointerEvents: "none", position: "absolute", top: 0 }}>
    Click to edit text
  </div>
);

const FocusPlugin = ({ editing }: { editing: boolean }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editing) {
      editor.setEditable(true);
      editor.focus();
      return;
    }
    editor.setEditable(false);
  }, [editing, editor]);
  return null;
};

export const LexicalClient = ({
  id,
  state,
  editing,
  onChange = () => {},
}: {
  id: string;
  state: SerializedEditorState;
  editing: boolean;
  onChange?: (props: { state: SerializedEditorState }) => void;
}) => {
  return (
    <div style={{ position: "relative" }}>
      <LexicalComposer
        initialConfig={{
          namespace: id,
          editable: false,
          editorState: JSON.stringify(state),
          onError(error: unknown) {
            throw error;
          },
        }}
      >
        {/*<Toolbar />*/}
        <RichTextPlugin
          contentEditable={<ContentEditable style={{ outline: "none" }} />}
          placeholder={PlaceHolder}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          ignoreSelectionChange
          onChange={(state) => onChange({ state: state.toJSON() })}
        />
        <FocusPlugin editing={editing} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};