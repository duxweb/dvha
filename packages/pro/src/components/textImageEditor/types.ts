export type TextImageEditorBlockType = 'image' | 'text'

export interface TextImageEditorBaseBlock {
  id: string
  type: TextImageEditorBlockType
}

export interface TextImageEditorImageBlock extends TextImageEditorBaseBlock {
  type: 'image'
  url?: string
  alt?: string
}

export interface TextImageEditorTextBlock extends TextImageEditorBaseBlock {
  type: 'text'
  /**
   * Richtext html (AiEditor.getHtml) or markdown (AiEditor.getMarkdown),
   * depending on editorType configured by consumer.
   */
  content?: string
}

export type TextImageEditorBlock = TextImageEditorImageBlock | TextImageEditorTextBlock
