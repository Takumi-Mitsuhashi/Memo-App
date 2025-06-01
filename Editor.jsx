import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
// import { v4 as uuidv4 } from 'uuid';

export default function Editor() {
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState({
    title: "",
    body: "",
  });
  const [isVisible, setIsVisible] = useState(true);

  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];


  const handleChange = (e) => {
    setCurrentText({
      ...currentText,
      [e.target.name]: e.target.value,
    });
  };

  const addText = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const newText = {
      time: time,
      date: today,
      title: currentText.title,
      body: currentText.body,
    };

    setTexts([...texts, newText]);
    setCurrentText({ title: "", body: "" });
    setIsVisible(false);

    console.log("追加メモ:", newText);

  };


  const addContent = async () => {
    try {
      const requests = texts.map((text) =>
        fetch("http://localhost:5000/items/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(text),
        }).then((res) => {
          if (!res.ok) {
            throw new Error("保存に失敗しました");
          }
          return res.json(); 
        })
      );

      await Promise.all(requests);

      navigate("/");
    } catch (err) {
      console.error("保存エラー：", err);
    }
  };



  const deleteContent = async (time, title, body) => {
    setTexts((prevTexts) =>  prevTexts.filter((text) => !(text.time === time && text.title === title && text.body === body)));
  };

  return (
    <>
      <div className="date-container">
        <div className="date-inner-container">
          <button onClick={() => navigate("/")}>&lt; 戻る</button>
          <button onClick={addContent} style={{marginRight: "2vw"}}>完了</button>
        </div>
        <p>{today}</p>
      </div>
      {texts.map((item) => (
        <div className="collection-container" key={item.time + item.title}>
          <p style={{ fontSize: "15px", fontWeight: "bold" }}>{item.title}</p>
          <p style={{ fontSize: "10px" }}>{item.body}</p>
          <div className="col-inner-container">
            <div>{item.time}</div>
            <button
              className="delete-btn"
              onClick={() =>
                deleteContent(item.time, item.title, item.body)
              }
            >
              削除
            </button>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={() => setIsVisible(true)}>
        +
      </button>
      {isVisible && (
        <div className="edit-container">
          <header>
            <button onClick={() => setIsVisible(false)}>戻る</button>
            <button
              onClick={addText}
              disabled={!currentText.title || !currentText.body}
            >
              追加
            </button>
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
    </>
  );
}
