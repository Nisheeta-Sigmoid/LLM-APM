export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          max-w-[75%]
          px-4 py-3
          rounded-2xl
          text-sm leading-relaxed
          whitespace-pre-wrap
          break-words
          ${
            isUser
              ? "bg-black text-white rounded-br-md"
              : "bg-white text-zinc-800 shadow rounded-bl-md"
          }
        `}
      >
        {content}
      </div>
    </div>
  );
}
