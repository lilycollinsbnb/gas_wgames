import MarkdownRenderer from '../ui/markdown-renderer'

export const GameDescription: React.FC<{ description: string }> = ({
  description
}) => (
  <div className="mt-6 rounded-2xl">
    <div className="mt-4">
      <MarkdownRenderer content={description} />
    </div>
  </div>
)
