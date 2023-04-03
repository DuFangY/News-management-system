import React, { useState } from 'react'
import { useEffect } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState} from 'draft-js';
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader(); // eslint-disable-line no-undef
      reader.onload = e => resolve({ data: { link: e.target.result,key: Date.now() } });
      reader.onerror = e => reject(e);
      reader.readAsDataURL(file);
    });
}



export default function NewsEditor(props) {

  const [editorState, setEditorState] = useState('')
  const { content } = props
  useEffect(() => {
    if (content !== null) {
      const draftContent = htmlToDraft(content)
      // console.log('@@@',draftContent)
      const contentState = ContentState.createFromBlockArray(draftContent.contentBlocks,draftContent.entityMap);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
      
    }
  }, [content])

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={(editorState) => { setEditorState(editorState) }}
        onBlur={() => props.getContent(editorState)}
        toolbar={{
          textAlign: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallBack,
            previewImage: true,
          },
        }}
      />
    </div>

  )
}
