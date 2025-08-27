import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import VideoPlayer from '../video/video-player'
import ContactForm from '../contact/contact-form'

interface MarkdownRendererProps {
  content: string
  className?: string
  allowHtml?: boolean
  sanitizeHtml?: boolean
  enableMarkdownPreprocessing?: boolean
}

type Segment =
  | { type: 'text'; content: string }
  | {
      type: 'videoBlock'
      videoType: 'youtube' | 'mp4'
      videoId: string
      url: string
      content: string
      layout: 'left' | 'right' | 'left-wrap' | 'right-wrap' | 'center'
    }
  | { type: 'form'; formId: string }

const splitContent = (content: string): Segment[] => {
  const segments: Segment[] = []
  let lastIndex = 0

  const wrappedVideoRegex =
    /\[\[video:(youtube|mp4):(.+?)\|layout=(left-wrap|right-wrap)\]\]\^\^([\s\S]*?)\[\[\/video\]\]/g

  const inlineVideoRegex =
    /\[\[video:(youtube|mp4):(.+?)(?:\|layout=(center|left|right))?\]\]/g

  const formRegex = /\[\[form:(.+?)\]\]/g

  const matches: {
    index: number
    endIndex: number
    match: RegExpExecArray
    type: 'videoWrap' | 'videoInline' | 'form'
  }[] = []

  let match

  while ((match = wrappedVideoRegex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      endIndex: match.index + match[0].length,
      match,
      type: 'videoWrap'
    })
  }

  while ((match = inlineVideoRegex.exec(content)) !== null) {
    const matchStart = match.index
    const matchEnd = match.index + match[0].length

    // Skip inline matches that overlap with any wrapped block
    const overlaps = matches.some(
      (m) =>
        m.type === 'videoWrap' &&
        matchStart >= m.index &&
        matchStart < m.endIndex
    )
    if (!overlaps) {
      matches.push({
        index: matchStart,
        endIndex: matchEnd,
        match,
        type: 'videoInline'
      })
    }
  }

  while ((match = formRegex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      endIndex: match.index + match[0].length,
      match,
      type: 'form'
    })
  }

  // Sort all matches in content order
  matches.sort((a, b) => a.index - b.index)

  for (const { index, endIndex, match, type } of matches) {
    if (index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, index)
      })
    }

    if (type === 'videoWrap') {
      const [_, videoType, videoId, layout, blockText] = match
      segments.push({
        type: 'videoBlock',
        videoType: videoType as 'youtube' | 'mp4',
        videoId,
        url: videoId,
        content: blockText.trim(),
        layout: layout as 'left-wrap' | 'right-wrap'
      })
    }

    if (type === 'videoInline') {
      const [_, videoType, videoId, layout] = match
      segments.push({
        type: 'videoBlock',
        videoType: videoType as 'youtube' | 'mp4',
        videoId,
        url: videoId,
        content: '',
        layout: (layout || 'center') as 'left' | 'right' | 'center'
      })
    }

    if (type === 'form') {
      const [, formId] = match
      segments.push({
        type: 'form',
        formId
      })
    }

    lastIndex = endIndex
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex)
    })
  }

  return segments
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  allowHtml = false,
  sanitizeHtml = true,
  enableMarkdownPreprocessing = false
}) => {
  const rehypePlugins = [] as any[]

  if (allowHtml) {
    rehypePlugins.push(rehypeRaw)
    if (sanitizeHtml) {
      rehypePlugins.push([rehypeSanitize, defaultSchema])
    }
  }

  if (!enableMarkdownPreprocessing) {
    return (
      <div className={`markdown-body markdown-container ${className || ''}`}>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks, remarkGfm]}
          rehypePlugins={rehypePlugins}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  const segments = splitContent(content)

  return (
    <div className={`markdown-body markdown-container ${className || ''}`}>
      {segments.map((segment, idx) => {
        switch (segment.type) {
          case 'text':
            return (
              <ReactMarkdown
                key={idx}
                remarkPlugins={[remarkBreaks, remarkGfm]}
                rehypePlugins={rehypePlugins}
              >
                {segment.content}
              </ReactMarkdown>
            )

          case 'videoBlock': {
            const { layout, videoType, url, content } = segment

            const video = (
              <VideoPlayer
                videoUrl={url}
                playing={false}
                muted={true}
                type={videoType}
              />
            )

            const text = (
              <ReactMarkdown
                key={`${idx}-text`}
                remarkPlugins={[remarkBreaks, remarkGfm]}
                rehypePlugins={rehypePlugins}
              >
                {content}
              </ReactMarkdown>
            )

            if (layout === 'center') {
              return (
                <div
                  key={idx}
                  className="w-full max-w-3xl mx-auto my-6 flex justify-center"
                >
                  {video}
                </div>
              )
            }

            if (layout === 'left' || layout === 'right') {
              return (
                <div
                  key={idx}
                  className={`w-full my-6 flex ${layout === 'left' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="w-full max-w-3xl">{video}</div>
                </div>
              )
            }

            // Separate case for left-wrap / right-wrap
            if (layout === 'left-wrap' || layout === 'right-wrap') {
              const floatClass =
                layout === 'left-wrap' ? 'float-left mr-8' : 'float-right ml-8'

              return (
                <div key={idx} className="my-4 clearfix overflow-hidden">
                  <div className={`w-full max-w-[55%] ${floatClass}`}>
                    {video}
                  </div>
                  <div className="text-justify">{text}</div>
                </div>
              )
            }

            return null
          }

          case 'form':
            if (segment.formId === 'contact-form') {
              return (
                <div key={idx} className="my-6">
                  <ContactForm />
                </div>
              )
            }
            return null

          default:
            return null
        }
      })}
    </div>
  )
}

export default MarkdownRenderer
