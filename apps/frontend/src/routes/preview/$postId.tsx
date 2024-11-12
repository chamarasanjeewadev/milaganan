import { createFileRoute } from '@tanstack/react-router'
import PreviewHeader from '../../components/PreviewHeder'

export const Route = createFileRoute('/preview/$postId')({
  component: PostComponent,
})

function PostComponent() {
  const { postId } = Route.useParams()
  console.log('Route Params:', Route.useParams())
  console.log('PostID:', postId, typeof postId)
  return <PreviewHeader id={postId} />
}
