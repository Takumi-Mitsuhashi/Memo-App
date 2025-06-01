import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Display() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get("date");

  const [memos, setMemos] = useState([]);
  const [deletedTexts, setDeletedTexts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [currentText, setCurrentText] = useState({
    _id: "",      
    title: "",
    body: "",
  });
  const [newContent, setNewContent] = useState([]);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/items?date=${date}`);
        if (!res.ok) throw new Error("取得に失敗しました");
        const data = await res.json();
        setMemos(data);
      } catch (err) {
        console.error("取得エラー:", err);
      }
    };

    if (date) {
      fetchMemos();
    }
  }, [date]);

  const handleChange = (e) => {
    setCurrentText({
      ...currentText,
      [e.target.name]: e.target.value,
    });
  };

  const addText = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentText.title,
          body: currentText.body,
        }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      const updatedMemo = await response.json();

      setMemos((prevMemos) =>
        prevMemos.map((memo) =>
          memo._id === id
            ? { ...memo, title: updatedMemo.title, body: updatedMemo.body }
            : memo
        )
      );

      setCurrentText({ _id: "", title: "", body: "" });
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  const deleteContent = async (_id, time, date, title, body) => {
    const newDeletedText = { _id, time, date, title, body };

    try {
      const backupResponse = await fetch("http://localhost:5000/items/deleted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeletedText),
      });

      if (!backupResponse.ok) throw new Error("バックアップに失敗しました");

      console.log('Deleting memo:', title, body);
      const deleteResponse = await fetch(`http://localhost:5000/items`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ title, body }), 
        body: JSON.stringify({ _id }), 
      });

      if (!deleteResponse.ok) throw new Error("削除に失敗しました");

      setDeletedTexts([...deletedTexts, newDeletedText]);
      setMemos((prevTexts) => prevTexts.filter((text) => text._id !== _id));
    } catch (err) {
      console.error("保存エラー：", err);
    }
  };

  const addContent = async (title, body) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const newMemo = {
      time: time,
      date: date,
      title: title,
      body: body,
    }

    try {
      const res = await fetch("http://localhost:5000/items/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemo),
      });
      
      if (!res.ok) throw new Error("保存に失敗しました");
      
      await res.json();

      window.location.reload();
     
    } catch (err) {
      console.error("保存エラー：", err);
    }

  }

  return (
    <div>
      <div className="date-container">
        <div className="date-inner-container">
          <button onClick={() => navigate("/")}>← 戻る</button>
        </div>
        <p>{date}</p>
      </div>

      {memos.length > 0 ? (
        memos.map((memo) => (
          <div
            key={memo._id} 
            className="collection-container"
            onClick={() => {
              setCurrentText({ _id: memo._id, title: memo.title, body: memo.body }); 
              setIsVisible(true);
            }}
          >
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>{memo.title}</p>
            <p style={{ fontSize: "10px" }}>{memo.body}</p>
            <div className="col-inner-container">
              <div>{memo.time}</div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteContent(memo._id, memo.time, memo.date, memo.title, memo.body); 
                }}
              >
                削除
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>この日のメモはありません。</p>
      )}

      <button className="add-btn" onClick={() => {
        setIsVisible(true);
        setIsVisible2(true);
       }}
      >
        +
      </button>
      {isVisible && (
        <div className="edit-container">
          <header>
            <button onClick={() => {
                setIsVisible(false);
                setCurrentText({ _id: "", title: "", body: "" });
                }}
            >
            戻る
            </button>
            {isVisible && !isVisible2 && (
            <button
              onClick={() => {
                addText(currentText._id);
                setIsVisible(false);
              }}
              disabled={!currentText.title || !currentText.body}
            >
              完了
            </button>
            )}
            {isVisible2 && (
                <button
              onClick={() => {
                setIsVisible(false);
                addContent(currentText.title, currentText.body);
              }}
              disabled={!currentText.title || !currentText.body}
            >
              追加
            </button>
            )}
          </header>
          <input
            type="text"
            name="title"
            placeholder="タイトル"
            value={currentText.title}
            onChange={handleChange}
            className="newword"
          />

          <textarea
            name="body"
            placeholder="メモを入力…"
            value={currentText.body}
            onChange={handleChange}
            className="comment"
          />
        </div>
      )}
    </div>
  );
}
