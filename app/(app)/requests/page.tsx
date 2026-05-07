'use client'

import { useState, useEffect } from 'react'
import { getRequests, addRequest, addReply, type Request } from '@/lib/store'
import { useNotification } from '@/lib/notification-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty } from '@/components/ui/empty'
import { MessageSquare, Send, Loader2, Clock, CheckCircle, Reply as ReplyIcon, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function RequestsPage() {
  const { addNotification } = useNotification()
  const [requests, setRequests] = useState<Request[]>([])
  const [newRequest, setNewRequest] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({})
  const [submittingReplies, setSubmittingReplies] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    setRequests(getRequests())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRequest.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600))

    const request = addRequest(newRequest.trim(), 'You')
    setRequests(prev => [request, ...prev])
    setNewRequest('')
    setIsSubmitting(false)
    addNotification('Request posted to community!', 'success')
  }

  const handleReplySubmit = async (requestId: string) => {
    const replyText = replyInputs[requestId]?.trim()
    if (!replyText) return

    setSubmittingReplies(prev => ({ ...prev, [requestId]: true }))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400))

    addReply(requestId, replyText, 'You')
    setRequests(getRequests())
    setReplyInputs(prev => ({ ...prev, [requestId]: '' }))
    setSubmittingReplies(prev => ({ ...prev, [requestId]: false }))
    addNotification('Reply posted!', 'success')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Community Requests</h1>
        <p className="text-muted-foreground mt-1">
          Can&apos;t find what you need? Post a request and let the community help!
        </p>
      </div>

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Post a Request
          </CardTitle>
          <CardDescription>
            Describe what you&apos;re looking for and community members will reach out.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              placeholder="What do you need? e.g., 'Looking for a projector for the weekend'"
              value={newRequest}
              onChange={e => setNewRequest(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newRequest.trim() || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Requests</h2>
          <Badge variant="secondary">{requests.length} request{requests.length !== 1 ? 's' : ''}</Badge>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <Empty
                icon={MessageSquare}
                title="No requests yet"
                description="Be the first to post a request to the community!"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map(request => (
              <Card key={request.id} className="overflow-hidden">
                <CardContent className="p-4">
                  {/* Request Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{request.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                        </div>
                        <span className="text-xs">by {request.requesterName}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={request.status === 'Open' ? 'default' : 'secondary'}
                      className="shrink-0"
                    >
                      {request.status === 'Open' ? (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Open
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Fulfilled
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Replies Section */}
                  {expandedRequestId === request.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      {request.replies.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {request.replies.map(reply => (
                            <div key={reply.id} className="bg-secondary/30 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <div className="mt-1">
                                  <div className="w-2 h-2 bg-accent rounded-full" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-foreground">{reply.responderName}</span>
                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                                  </div>
                                  <p className="text-sm text-foreground mt-1">{reply.message}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Share your response..."
                          value={replyInputs[request.id] || ''}
                          onChange={(e) => setReplyInputs(prev => ({ ...prev, [request.id]: e.target.value }))}
                          className="text-sm"
                        />
                        <Button 
                          size="sm"
                          onClick={() => handleReplySubmit(request.id)}
                          disabled={!replyInputs[request.id]?.trim() || submittingReplies[request.id]}
                        >
                          {submittingReplies[request.id] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Reply Button */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {request.replies.length} {request.replies.length === 1 ? 'response' : 'responses'}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedRequestId(expandedRequestId === request.id ? null : request.id)}
                      className="gap-1"
                    >
                      <ReplyIcon className="h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Community Info Card */}
      <div className="space-y-3">
        <Card className="bg-accent/20 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-accent-foreground">Community members can respond to requests.</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When you post a request, all verified community members can see it and respond with helpful suggestions or offers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/20 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-accent-foreground">How it works</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Post what you need, and community members will respond. Check back on your requests to see who can help!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
