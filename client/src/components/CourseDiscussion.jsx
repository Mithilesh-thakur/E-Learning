import { useState, useEffect } from "react";
import axios from "axios";
import { authAxios } from "@/lib/authAxios";
import { toast } from "sonner";
import PropTypes from "prop-types";

const API_BASE = "http://localhost:8080/api/v1";

function CourseDiscussion({ courseId, token }) {
  const [discussions, setDiscussions] = useState([]);
  const [question, setQuestion] = useState("");
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  // Fetch discussions
  useEffect(() => {
    setLoading(true);
    setError("");
    authAxios().get(`${API_BASE}/discussion/discussions/${courseId}`)
      .then(res => setDiscussions(res.data.discussions || []))
      .catch(() => setError("Failed to load discussions."))
      .finally(() => setLoading(false));
  }, [courseId, token]);

  // Post a new question
  const handlePostQuestion = async () => {
    if (!question.trim()) return toast.error("Question cannot be empty.");
    setLoading(true);
    try {
      await authAxios().post(`${API_BASE}/discussion/discussion`, { courseId, question });
      setQuestion("");
      toast.success("Question posted!");
      const res = await authAxios().get(`${API_BASE}/discussion/discussions/${courseId}`);
      setDiscussions(res.data.discussions || []);
    } catch {
      toast.error("Failed to post question.");
    } finally {
      setLoading(false);
    }
  };

  // Edit a question
  const handleEditQuestion = async (discussionId) => {
    if (!editText.trim()) return toast.error("Question cannot be empty.");
    setLoading(true);
    try {
      await authAxios().put(`${API_BASE}/discussion/${discussionId}`, { question: editText });
      setEditId(null);
      setEditText("");
      toast.success("Question updated!");
      const res = await authAxios().get(`${API_BASE}/discussion/discussions/${courseId}`);
      setDiscussions(res.data.discussions || []);
    } catch {
      toast.error("Failed to update question.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a question
  const handleDeleteQuestion = async (discussionId) => {
    setLoading(true);
    try {
      await authAxios().delete(`${API_BASE}/discussion/${discussionId}`);
      toast.success("Question deleted!");
      const res = await authAxios().get(`${API_BASE}/discussion/discussions/${courseId}`);
      setDiscussions(res.data.discussions || []);
    } catch {
      toast.error("Failed to delete question.");
    } finally {
      setLoading(false);
    }
  };

  // Edit a reply
  const handleEditReply = async (replyId, discussionId) => {
    if (!editReplyText.trim()) return toast.error("Reply cannot be empty.");
    setReplyLoading(prev => ({ ...prev, [discussionId]: true }));
    try {
      await authAxios().put(`${API_BASE}/discussion/reply/${replyId}`, { reply: editReplyText });
      setEditReplyId(null);
      setEditReplyText("");
      toast.success("Reply updated!");
      const res = await authAxios().get(`${API_BASE}/discussion/discussion/replies/${discussionId}`);
      setReplies(prev => ({ ...prev, [discussionId]: res.data.replies || [] }));
    } catch {
      toast.error("Failed to update reply.");
    } finally {
      setReplyLoading(prev => ({ ...prev, [discussionId]: false }));
    }
  };

  // Delete a reply
  const handleDeleteReply = async (replyId, discussionId) => {
    setReplyLoading(prev => ({ ...prev, [discussionId]: true }));
    try {
      await authAxios().delete(`${API_BASE}/discussion/reply/${replyId}`);
      toast.success("Reply deleted!");
      const res = await authAxios().get(`${API_BASE}/discussion/discussion/replies/${discussionId}`);
      setReplies(prev => ({ ...prev, [discussionId]: res.data.replies || [] }));
    } catch {
      toast.error("Failed to delete reply.");
    } finally {
      setReplyLoading(prev => ({ ...prev, [discussionId]: false }));
    }
  };

  // Post a reply
  const handleReply = async (discussionId) => {
    const replyText = replyInputs[discussionId] || "";
    if (!replyText.trim()) return toast.error("Reply cannot be empty.");
    setReplyLoading(prev => ({ ...prev, [discussionId]: true }));
    try {
      await authAxios().post(`${API_BASE}/discussion/discussion/reply`, { discussionId, reply: replyText });
      toast.success("Reply posted!");
      setReplyInputs(prev => ({ ...prev, [discussionId]: "" }));
      const res = await authAxios().get(`${API_BASE}/discussion/discussion/replies/${discussionId}`);
      setReplies(prev => ({ ...prev, [discussionId]: res.data.replies || [] }));
    } catch {
      toast.error("Failed to post reply.");
    } finally {
      setReplyLoading(prev => ({ ...prev, [discussionId]: false }));
    }
  };

  // Fetch replies for a discussion
  const fetchReplies = (discussionId) => {
    setReplyLoading(prev => ({ ...prev, [discussionId]: true }));
    authAxios().get(`${API_BASE}/discussion/discussion/replies/${discussionId}`)
      .then(res => setReplies(prev => ({ ...prev, [discussionId]: res.data.replies || [] })))
      .catch(() => toast.error("Failed to load replies."))
      .finally(() => setReplyLoading(prev => ({ ...prev, [discussionId]: false })));
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow">
      <h2 className="text-xl font-bold mb-4">Course Q&A</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button
          className={`px-4 py-2 bg-blue-600 text-white rounded ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          onClick={handlePostQuestion}
          disabled={loading}
        >{loading ? "Posting..." : "Post"}</button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading discussions...</div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No questions yet.</div>
        ) : (
          discussions.map(disc => (
            <div key={disc._id} className="mb-4 border-b pb-2">
              <div className="font-semibold">{disc.user?.name || "User"} <span className="text-xs text-gray-500">({disc.user?.role})</span></div>
              <div className="mb-2">
                {editId === disc._id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="border rounded p-1 mx-2"
                    />
                    <button className="text-green-600 text-xs mr-2" onClick={() => handleEditQuestion(disc._id)}>Save</button>
                    <button className="text-gray-500 text-xs" onClick={() => { setEditId(null); setEditText(""); }}>Cancel</button>
                  </>
                ) : disc.question}
              </div>
              {disc.user?._id === currentUserId && (
                <div className="flex gap-2 mb-2">
                  <button className="text-blue-500 text-xs" onClick={() => { setEditId(disc._id); setEditText(disc.question); }}>Edit</button>
                  <button className="text-red-500 text-xs" onClick={() => handleDeleteQuestion(disc._id)}>Delete</button>
                </div>
              )}
              <button
                className={`text-blue-500 text-xs mb-2 ${replyLoading[disc._id] ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => fetchReplies(disc._id)}
                disabled={replyLoading[disc._id]}
              >{replyLoading[disc._id] ? "Loading..." : "View Replies"}</button>
              <div className="ml-4">
                {(replies[disc._id] || []).map(rep => (
                  <div key={rep._id} className="mb-1 text-sm flex items-center gap-2">
                    <span className="font-semibold">{rep.user?.name || "User"}:</span>
                    {editReplyId === rep._id ? (
                      <>
                        <input
                          type="text"
                          value={editReplyText}
                          onChange={e => setEditReplyText(e.target.value)}
                          className="border rounded p-1 mx-2"
                        />
                        <button className="text-green-600 text-xs mr-2" onClick={() => handleEditReply(rep._id, disc._id)}>Save</button>
                        <button className="text-gray-500 text-xs" onClick={() => { setEditReplyId(null); setEditReplyText(""); }}>Cancel</button>
                      </>
                    ) : rep.reply}
                    {rep.user?._id === currentUserId && (
                      <>
                        <button className="text-blue-500 text-xs" onClick={() => { setEditReplyId(rep._id); setEditReplyText(rep.reply); }}>Edit</button>
                        <button className="text-red-500 text-xs" onClick={() => handleDeleteReply(rep._id, disc._id)}>Delete</button>
                      </>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="p-1 border rounded w-2/3"
                    placeholder="Reply..."
                    value={replyInputs[disc._id] || ""}
                    onChange={e => setReplyInputs(prev => ({ ...prev, [disc._id]: e.target.value }))}
                    disabled={replyLoading[disc._id]}
                  />
                  <button
                    className={`px-2 py-1 bg-green-600 text-white rounded ${replyLoading[disc._id] ? "opacity-60 cursor-not-allowed" : ""}`}
                    onClick={() => handleReply(disc._id)}
                    disabled={replyLoading[disc._id]}
                  >{replyLoading[disc._id] ? "Replying..." : "Reply"}</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

CourseDiscussion.propTypes = {
  courseId: PropTypes.string.isRequired,
  token: PropTypes.string
};

export default CourseDiscussion;
