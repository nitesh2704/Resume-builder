import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import Button from './Button'
import { aiService } from '../services/aiService'

const emptyResponse = {
  name: '',
  role: '',
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  education: []
}

const DEFAULT_WIDTH = 340
const DEFAULT_HEIGHT = 560
const MIN_WIDTH = 320
const MIN_HEIGHT = 420

export default function AiResumeChatbot({ onApply }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const panelRef = useRef(null)
  const dragStateRef = useRef(null)
  const resizeStateRef = useRef(null)
  const hasPositionedRef = useRef(false)
  const positionRef = useRef(position)
  const sizeRef = useRef(size)

  const canSend = useMemo(() => message.trim().length > 0 && !loading, [message, loading])

  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    sizeRef.current = size
  }, [size])

  useEffect(() => {
    if (!open || hasPositionedRef.current) {
      return
    }

    const nextPosition = {
      x: Math.max(16, window.innerWidth - DEFAULT_WIDTH - 24),
      y: Math.max(88, window.innerHeight - DEFAULT_HEIGHT - 96)
    }
    setPosition(nextPosition)
    hasPositionedRef.current = true
  }, [open])

  useEffect(() => {
    const handleWindowResize = () => {
      setPosition((current) => ({
        x: Math.min(current.x, Math.max(16, window.innerWidth - sizeRef.current.width - 16)),
        y: Math.min(current.y, Math.max(72, window.innerHeight - sizeRef.current.height - 16))
      }))
    }

    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  useEffect(() => {
    const stopInteraction = () => {
      dragStateRef.current = null
      resizeStateRef.current = null
    }

    const handlePointerMove = (event) => {
      if (dragStateRef.current) {
        const { offsetX, offsetY } = dragStateRef.current
        const nextX = Math.min(
          Math.max(16, event.clientX - offsetX),
          Math.max(16, window.innerWidth - sizeRef.current.width - 16)
        )
        const nextY = Math.min(
          Math.max(72, event.clientY - offsetY),
          Math.max(72, window.innerHeight - sizeRef.current.height - 16)
        )
        setPosition({ x: nextX, y: nextY })
      }

      if (resizeStateRef.current) {
        const { startX, startY, startWidth, startHeight } = resizeStateRef.current
        const currentPosition = positionRef.current
        const nextWidth = Math.min(
          Math.max(MIN_WIDTH, startWidth + (event.clientX - startX)),
          Math.max(MIN_WIDTH, window.innerWidth - currentPosition.x - 16)
        )
        const nextHeight = Math.min(
          Math.max(MIN_HEIGHT, startHeight + (event.clientY - startY)),
          Math.max(MIN_HEIGHT, window.innerHeight - currentPosition.y - 16)
        )
        setSize({ width: nextWidth, height: nextHeight })
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopInteraction)
    window.addEventListener('pointercancel', stopInteraction)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopInteraction)
      window.removeEventListener('pointercancel', stopInteraction)
    }
  }, [])

  const applyResume = (data) => {
    onApply?.({ ...emptyResponse, ...data })
  }

  const hasResult = Boolean(
    lastResult &&
    (lastResult.summary || lastResult.skills?.length || lastResult.experience?.length || lastResult.projects?.length || lastResult.education?.length)
  )

  const handleSend = async () => {
    if (!canSend) {
      return
    }

    const userText = message.trim()
    setHistory((prev) => [...prev, { role: 'user', text: userText }])
    setMessage('')
    setLoading(true)
    setError('')

    try {
      const result = await aiService.generateResume({ input: userText })
      const normalized = { ...emptyResponse, ...result }
      setLastResult(normalized)

      const hasContent = Boolean(
        normalized.summary ||
        normalized.skills?.length ||
        normalized.experience?.length ||
        normalized.projects?.length ||
        normalized.education?.length ||
        normalized.name ||
        normalized.role
      )

      if (!hasContent) {
        setError('No structured details were returned. Try adding more specifics in your prompt.')
        setHistory((prev) => [...prev, { role: 'assistant', text: 'I could not extract details from that prompt.' }])
        return
      }

      const headline = normalized.role || normalized.name ? `${normalized.name || 'Candidate'} - ${normalized.role || 'Role'}` : 'Resume details are ready.'
      setHistory((prev) => [...prev, { role: 'assistant', text: headline }])
    } catch (err) {
      setError(err.message || 'Unable to generate resume details.')
      setHistory((prev) => [...prev, { role: 'assistant', text: 'I ran into an error. Please try again.' }])
      setLastResult(null)
    } finally {
      setLoading(false)
    }
  }

  const startDrag = (event) => {
    if (!panelRef.current || event.button !== 0) {
      return
    }

    const rect = panelRef.current.getBoundingClientRect()
    dragStateRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    }
    event.preventDefault()
  }

  const startResize = (event) => {
    if (event.button !== 0) {
      return
    }

    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: sizeRef.current.width,
      startHeight: sizeRef.current.height
    }
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-verdant-primary to-green-500 text-white shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
        aria-label="Open AI assistant"
      >
        <Bot className="h-6 w-6" />
      </button>

      <div
        ref={panelRef}
        style={{ left: `${position.x}px`, top: `${position.y}px`, width: `${size.width}px`, height: `${size.height}px` }}
        className={`fixed z-40 origin-top-left overflow-hidden rounded-2xl border border-green-200 bg-white/80 shadow-2xl backdrop-blur-2xl transition-[opacity,transform,left,top,width,height] duration-300 dark:border-emerald-900 dark:bg-verdant-dark-panel/80 ${open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
          }`}
      >
        <div
          onPointerDown={startDrag}
          className="flex cursor-grab items-center justify-between border-b border-green-100 px-4 py-3 active:cursor-grabbing dark:border-emerald-900"
        >
          <div className="flex items-center gap-2 text-sm font-extrabold text-gray-950 dark:text-white">
            <Sparkles className="h-4 w-4 text-verdant-primary dark:text-green-300" />
            AI Resume Assistant
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-[calc(100%-3.75rem)] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {history.length === 0 ? (
              <div className="rounded-xl border border-dashed border-green-200 bg-green-50/60 p-3 text-xs text-green-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-green-200">
                Share a short summary like: "I am a backend developer with 2 years experience in Java, Spring Boot..."
              </div>
            ) : null}

            {history.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`rounded-xl px-3 py-2 text-xs leading-5 ${item.role === 'user'
                  ? 'ml-auto max-w-[85%] bg-verdant-primary text-white'
                  : 'mr-auto max-w-[85%] bg-green-50 text-gray-700 dark:bg-emerald-950 dark:text-gray-200'
                  }`}
              >
                {item.text}
              </div>
            ))}

            {hasResult ? (
              <div className="rounded-xl border border-green-200 bg-white p-3 text-xs text-gray-700 shadow-sm dark:border-emerald-900 dark:bg-verdant-dark-panel dark:text-gray-200">
                <p className="font-semibold text-gray-900 dark:text-white">Extracted details</p>
                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Summary</p>
                <p className="text-xs leading-5">{lastResult.summary || 'No summary provided.'}</p>
                <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">Skills</p>
                <p className="text-xs leading-5">{lastResult.skills?.length ? lastResult.skills.join(', ') : 'No skills provided.'}</p>
              </div>
            ) : null}

            {loading ? (
              <div className="mr-auto max-w-[85%] rounded-xl bg-green-50 px-3 py-2 text-xs text-gray-600 dark:bg-emerald-950 dark:text-gray-200">
                Generating resume details...
              </div>
            ) : null}

            {error ? <div className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</div> : null}
          </div>

          <div className="border-t border-green-100 p-3 dark:border-emerald-900">
            {hasResult ? (
              <div className="mb-2 flex items-center justify-between rounded-xl border border-green-100 bg-green-50/70 px-3 py-2 text-xs text-green-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-green-200">
                <span>Apply these details to the form?</span>
                <button
                  type="button"
                  onClick={() => applyResume(lastResult)}
                  className="rounded-full bg-verdant-primary px-3 py-1 text-[11px] font-semibold text-white"
                >
                  Apply
                </button>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Describe your background..."
                className="h-11 flex-1 rounded-xl border border-green-200 bg-white px-3 text-xs text-gray-800 shadow-sm outline-none focus:border-verdant-primary dark:border-emerald-900 dark:bg-verdant-dark-panel dark:text-gray-100"
              />
              <Button className="h-11 px-4" onClick={handleSend} loading={loading} disabled={!canSend}>
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Resize assistant"
          onPointerDown={startResize}
          className="absolute bottom-1 right-1 h-4 w-4 cursor-se-resize rounded-br-2xl bg-gradient-to-br from-transparent via-green-300/60 to-verdant-primary/80 opacity-70 transition-opacity hover:opacity-100 dark:via-emerald-500/50"
        />
      </div>
    </>
  )
}
