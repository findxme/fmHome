import { query } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function getPurchases(req, res) {
  const { month, limit = 20 } = req.query;
  
  const limitNum = parseInt(limit);
  let sql = `SELECT * FROM purchases ORDER BY purchaseDate DESC, purchaseTime DESC LIMIT ${limitNum}`;
  let params = [];
  
  if (month) {
    const [year, m] = month.split('-');
    const startDate = `${year}-${m.padStart(2, '0')}-01`;
    const nextMonth = parseInt(m) + 1;
    const endDate = nextMonth > 12 ? `${parseInt(year) + 1}-01-01` : `${year}-${nextMonth.toString().padStart(2, '0')}-01`;
    
    sql = `SELECT * FROM purchases WHERE purchaseDate >= ? AND purchaseDate < ? ORDER BY purchaseDate DESC, purchaseTime DESC LIMIT ${limitNum}`;
    params = [startDate, endDate];
  }
  
  const purchases = await query(sql, params);
  
  const purchasesWithItems = await Promise.all(purchases.map(async purchase => {
    purchase.items = await query('SELECT * FROM purchaseItems WHERE purchaseId = ?', [purchase.id]);
    purchase.date = purchase.purchaseDate;
    purchase.time = purchase.purchaseTime;
    return purchase;
  }));
  
  res.json({ success: true, data: purchasesWithItems });
}

export async function createPurchase(req, res) {
  const { storeName, purchaseDate, date, time, totalAmount, sourceType, note, items } = req.body;
  
  const id = uuidv4();
  const finalDate = purchaseDate || date || new Date().toISOString().split('T')[0];
  const finalTime = time || new Date().toTimeString().slice(0, 5);
  const finalStoreName = storeName || null;
  const finalNote = note || null;
  const finalSourceType = sourceType || 'manual';
  
  await query(
    'INSERT INTO purchases (id, storeName, purchaseDate, purchaseTime, totalAmount, sourceType, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, finalStoreName, finalDate, finalTime, totalAmount || 0, finalSourceType, finalNote]
  );
  
  if (items && items.length > 0) {
    for (const item of items) {
      const itemName = item.name || '';
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      await query(
        'INSERT INTO purchaseItems (id, purchaseId, name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), id, itemName, quantity, price]
      );
    }
  }
  
  const [purchase] = await query('SELECT * FROM purchases WHERE id = ?', [id]);
  purchase.items = await query('SELECT * FROM purchaseItems WHERE purchaseId = ?', [id]);
  
  res.json({ success: true, data: purchase });
}

export async function getPurchaseStats(req, res) {
  const { month } = req.query;
  
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  const [year, m] = currentMonth.split('-');
  const startDate = `${year}-${m.padStart(2, '0')}-01`;
  const nextMonth = parseInt(m) + 1;
  const endDate = nextMonth > 12 ? `${parseInt(year) + 1}-01-01` : `${year}-${nextMonth.toString().padStart(2, '0')}-01`;
  
  const monthRecords = await query(
    'SELECT * FROM purchases WHERE purchaseDate >= ? AND purchaseDate < ? ORDER BY purchaseDate DESC',
    [startDate, endDate]
  );
  
  const recordsWithItems = await Promise.all(monthRecords.map(async record => {
    record.items = await query('SELECT * FROM purchaseItems WHERE purchaseId = ?', [record.id]);
    return record;
  }));
  
  const totalAmount = recordsWithItems.reduce((sum, record) => sum + parseFloat(record.totalAmount || 0), 0);
  const latestRecord = recordsWithItems[0] || null;
  
  const itemMap = new Map();
  recordsWithItems.forEach(record => {
    record.items.forEach(item => {
      const existing = itemMap.get(item.name);
      itemMap.set(item.name, {
        name: item.name,
        count: existing ? existing.count + 1 : 1
      });
    });
  });
  
  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  res.json({ success: true, data: {
    totalAmount,
    latestRecord,
    topItems,
    recordCount: recordsWithItems.length,
    month: currentMonth
  }});
}

export async function deletePurchase(req, res) {
  const { id } = req.params;
  
  await query('DELETE FROM purchases WHERE id = ?', [id]);
  
  res.json({ success: true, message: '删除成功' });
}

export async function updatePurchase(req, res) {
  const { id } = req.params;
  const { storeName, date, time, totalAmount, note, items } = req.body;
  
  const finalDate = date || new Date().toISOString().split('T')[0];
  const finalTime = time || new Date().toTimeString().slice(0, 5);
  
  await query(
    'UPDATE purchases SET storeName = ?, purchaseDate = ?, purchaseTime = ?, totalAmount = ?, note = ? WHERE id = ?',
    [storeName, finalDate, finalTime, totalAmount || 0, note || null, id]
  );
  
  await query('DELETE FROM purchaseItems WHERE purchaseId = ?', [id]);
  
  if (items && items.length > 0) {
    for (const item of items) {
      await query(
        'INSERT INTO purchaseItems (id, purchaseId, name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), id, item.name, item.quantity || 1, item.price || 0]
      );
    }
  }
  
  const [purchase] = await query('SELECT * FROM purchases WHERE id = ?', [id]);
  purchase.items = await query('SELECT * FROM purchaseItems WHERE purchaseId = ?', [id]);
  
  res.json({ success: true, data: purchase });
}
