import express from 'express';
import Memo from '../models/Memo.js';
import DeletedMemo from '../models/DeletedMemo.js';

const router = express.Router();

router.get("/", async (req, res) => {
  const dateStr = req.query.date;

  if (!dateStr) {
    return res.status(400).json({ error: "日付が指定されていません" });
  }

  try {
    const memos = await Memo.find({ date: dateStr }).sort({ createdAt: 1 });
    res.json(memos);
  } catch (err) {
    console.error("メモ取得エラー:", err);
    res.status(500).json({ error: "サーバーエラー" });
  }
});


router.delete('/', async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: '_idが必要です' });
  }

  try {
    const result = await Memo.findByIdAndDelete(_id);

    if (!result) {
      return res.status(404).json({ message: '一致するメモが見つかりませんでした' });
    }

    res.status(200).json({ message: '削除成功', deleted: result });
  } catch (err) {
    console.error('削除エラー:', err);
    res.status(500).json({ message: '削除に失敗しました' });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const memo = await Memo.find().sort({ updatedAt: -1 }).limit(1);
    res.json(memo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const newMemo = new Memo({
      time: req.body.time,
      date: req.body.date,
      title: req.body.title,
      body: req.body.body,
    });
    const saved = await newMemo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving item' });
  }
});

router.post('/deleted', async (req, res) => {
    try {
        const newDeletedMemo = new DeletedMemo({
            time: req.body.time,
            title: req.body.title,
            body: req.body.body,
        });
        const saved = await newDeletedMemo.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({message: 'Error saving item'});
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedMemo = await Memo.findByIdAndUpdate(
              req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedMemo) {
            return res.status(404).json({message: 'メモが見つかりません'});
        }

        res.json(updatedMemo);

    } catch (error) {
        console.error('PATCH更新エラー詳細:', error);
        res.status(500).json({message: '更新に失敗しました', error})
    }
});

export default router;