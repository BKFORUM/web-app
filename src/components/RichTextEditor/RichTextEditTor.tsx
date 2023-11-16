import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './styles.css'

interface IProp {
  editorState: EditorState
  onEditorStateChange: (editorState: EditorState) => void
  height?: string
}

const RichTextEditTor = ({ editorState, onEditorStateChange, height }: IProp) => {
  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper  "
        editorClassName={`demo-editor ${
          height === '100px' ? 'height-content-image' : 'height-content'
        } overflow-auto`}
        onEditorStateChange={onEditorStateChange}
        placeholder="Viết bài tại đây ..."
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign'],
          inline: { options: ['bold', 'italic', 'underline'], inDropdown: true },
          list: {
            options: ['unordered', 'indent', 'outdent'],
            inDropdown: true,
          },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
        }}
        mention={{
          separator: ' ',
          trigger: '@',
          suggestions: [
            { text: 'APPLE', value: 'apple', url: 'apple' },
            { text: 'BANANA', value: 'banana', url: 'banana' },
            { text: 'CHERRY', value: 'cherry', url: 'cherry' },
            { text: 'DURIAN', value: 'durian', url: 'durian' },
            { text: 'FIG', value: 'fig', url: 'fig' },
            { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
            { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
          ],
        }}
        hashtag={{}}
      />
    </div>
  )
}

export default RichTextEditTor
