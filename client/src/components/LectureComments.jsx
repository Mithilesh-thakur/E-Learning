import { useState, useEffect } from "react";
import axios from "axios";
import { authAxios } from "@/lib/authAxios";
import PropTypes from "prop-types";

const API_BASE = "http://localhost:8080/api/v1";

function LectureComments({ lectureId, token }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    setLoading(true);
    authAxios().get(`${API_BASE}/comment/comments/${lectureId}`)
      .then(res => setComments(res.data.comments || []))
      .finally(() => setLoading(false));
  }, [lectureId, token]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    await authAxios().post(`${API_BASE}/comment/comment`, { lectureId, comment });
    setComment("");
    authAxios().get(`${API_BASE}/comment/comments/${lectureId}`)
      .then(res => setComments(res.data.comments || []))
      .finally(() => setLoading(false));
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    await authAxios().delete(`${API_BASE}/comment/comment/${commentId}`);
    authAxios().get(`${API_BASE}/comment/comments/${lectureId}`)
      .then(res => setComments(res.data.comments || []))
      .finally(() => setLoading(false));
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    setLoading(true);
    await authAxios().put(`${API_BASE}/comment/comment/${commentId}`, { comment: editText });
    setEditId(null);
    setEditText("");
    authAxios().get(`${API_BASE}/comment/comments/${lectureId}`)
      .then(res => setComments(res.data.comments || []))
      .finally(() => setLoading(false));
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Lecture Comments</h2>
        <span className="text-xs text-gray-500">{comments.length} comment{comments.length !== 1 && "s"}</span>
      </div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Add a comment..."
          disabled={loading}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddComment} disabled={loading}>Comment</button>
      </div>
      {loading && <div className="text-center text-gray-400 mb-2">Loading comments...</div>}
      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {comments.length === 0 && !loading && (
          <div className="text-center text-gray-400">No comments yet. Be the first to comment!</div>
        )}
        {comments.map(c => (
          <div key={c._id} className="mb-2 flex justify-between items-center border-b pb-1">
            <div>
              <span className="font-semibold">{c.user?.name || "User"}:</span> {editId === c._id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="border rounded p-1 mx-2"
                  />
                  <button className="text-green-600 text-xs mr-2" onClick={() => handleEditComment(c._id)}>Save</button>
                  <button className="text-gray-500 text-xs" onClick={() => { setEditId(null); setEditText(""); }}>Cancel</button>
                </>
              ) : c.comment}
            </div>
            {c.user?._id === currentUserId && (
              <div className="flex gap-2">
                <button className="text-blue-500 text-xs" onClick={() => { setEditId(c._id); setEditText(c.comment); }}>Edit</button>
                <button className="text-red-500 text-xs" onClick={() => handleDeleteComment(c._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

LectureComments.propTypes = {
  lectureId: PropTypes.string.isRequired,
  token: PropTypes.string
};

export default LectureComments;
