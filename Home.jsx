import "./index.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { Plus } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const [memos, setMemos] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/items/recent')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMemos(data[0]);
        }
      })
      .catch(err => {
        console.error('取得エラー:', err);
      });
  }, []);


  return (
    <div>
      <header>
        <a href="">Calendar</a>
        <div>
          <input type="search" />
          <button>+</button>
        </div>
      </header>
      {memos && (
        <Link to={`/display?date=${memos.date}`} 
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="collection-container">
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>{memos.title}</p>
            <p style={{ fontSize: "10px" }}>{memos.body}・・・</p>
            <div className="col-inner-container">
              <div>{memos.date}</div>
            </div>
          </div>
        </Link>
      )}
      <button className="add-btn" onClick={() => navigate("/editor")}>
        +
      </button>
    </div>
  );
}
