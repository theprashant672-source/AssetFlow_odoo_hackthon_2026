import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { getAssets, createAsset, deleteAsset, type Asset } from '../api/client';

interface AssetForm {
  name: string;
  category: string;
  serialNumber: string;
  value: string;
}

const emptyForm: AssetForm = { name: '', category: '', serialNumber: '', value: '' };

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState<AssetForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAssets = async () => {
    setLoading(true);
    setError('');
    try {
      setAssets(await getAssets());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await createAsset({ ...form, value: Number(form.value) || 0 });
      setForm(emptyForm);
      loadAssets();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAsset(id);
      loadAssets();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="assets-page">
      <div className="assets-page-header">
        <h1>Assets</h1>
        <p>Track and manage every asset your organization owns.</p>
      </div>

      <div className="asset-card">
        <h2>Add a new asset</h2>
        <form onSubmit={handleSubmit} className="asset-form">
          <input
            name="name"
            placeholder="Asset name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="serialNumber"
            placeholder="Serial number"
            value={form.serialNumber}
            onChange={handleChange}
            required
          />
          <input
            name="value"
            type="number"
            placeholder="Value"
            value={form.value}
            onChange={handleChange}
          />
          <button type="submit">Add Asset</button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="table-wrapper">
        {loading ? (
          <p className="empty-state">Loading assets...</p>
        ) : assets.length === 0 ? (
          <p className="empty-state">No assets yet. Add your first one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Serial No.</th>
                <th>Status</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.serialNumber}</td>
                  <td>
                    <span className="status-badge">{asset.status}</span>
                  </td>
                  <td>{asset.value}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(asset._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
