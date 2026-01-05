'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser } from '@/lib/auth';
import {
  getVisionBoardItems,
  createVisionBoardItem,
  updateVisionBoardItem,
  deleteVisionBoardItem,
  uploadVisionBoardImage,
} from '@/lib/db';
import type { VisionBoardItem, VisionBoardCategory } from '@/entities/VisionBoardItem';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const categories: VisionBoardCategory[] = [
  'Career',
  'Health',
  'Relationships',
  'Mindset',
  'Lifestyle',
  'Finances',
  'Creativity',
  'Spirituality',
];

export default function VisionBoardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<VisionBoardItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VisionBoardCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<VisionBoardItem | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    loadItems(currentUser.id);
    setLoading(false);
  };

  const loadItems = async (userId: string) => {
    const visionItems = await getVisionBoardItems(userId);
    setItems(visionItems);
  };

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleAddItem = async (category: VisionBoardCategory, affirmation: string, file?: File) => {
    if (!user) return;

    setUploading(true);
    let imageUrl = null;

    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      imageUrl = await uploadVisionBoardImage(user.id, file);
      console.log('Image URL after upload:', imageUrl);
      if (!imageUrl) {
        console.error('Image upload failed - imageUrl is null');
      }
    }

    console.log('Creating vision board item with:', {
      category,
      affirmation,
      image_url: imageUrl,
      order_index: items.length,
    });

    const newItem = await createVisionBoardItem(user.id, {
      category,
      affirmation,
      image_url: imageUrl,
      order_index: items.length,
    });

    console.log('New item created:', newItem);

    if (newItem) {
      console.log('Item saved successfully. Image URL in DB:', newItem.image_url);
      setItems([...items, newItem]);
      setShowAddModal(false);
    }

    setUploading(false);
  };

  const handleUpdateItem = async (itemId: string, affirmation: string) => {
    const success = await updateVisionBoardItem(itemId, { affirmation });
    if (success) {
      setItems(items.map((item) => (item.id === itemId ? { ...item, affirmation } : item)));
      setEditingItem(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const success = await deleteVisionBoardItem(itemId);
    if (success) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your vision board...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <UserNotRegisteredError />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">Vision Board</h1>
            <p className="text-neutral-600 text-base">Visualize your dreams and aspirations</p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                selectedCategory === 'All'
                  ? 'bg-brand-100 text-brand-700 border-2 border-brand-300'
                  : 'bg-amber-100 text-neutral-700 hover:bg-amber-200 border-2 border-amber-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                  selectedCategory === category
                    ? 'bg-brand-100 text-brand-700 border-2 border-brand-300'
                    : 'bg-amber-100 text-neutral-700 hover:bg-amber-200 border-2 border-amber-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Add New Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-8 btn-primary"
          >
            + Add Vision Item
          </button>

          {/* Vision Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card group relative overflow-hidden"
              >
                {item.image_url && (
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-stone-200">
                    <img
                      src={item.image_url}
                      alt={item.affirmation}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', item.image_url);
                        console.error('Error:', e);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', item.image_url);
                      }}
                    />
                  </div>
                )}

                {/* Debug: Show image URL */}
                {item.image_url && (
                  <div className="text-xs text-neutral-500 mb-2 p-2 bg-stone-100 rounded break-all">
                    {item.image_url}
                  </div>
                )}

                <div className="mb-2">
                  <span className="text-xs font-medium px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {item.category}
                  </span>
                </div>

                {editingItem?.id === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      defaultValue={item.affirmation}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                      rows={3}
                      autoFocus
                      onBlur={(e) => handleUpdateItem(item.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleUpdateItem(item.id, e.currentTarget.value);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <p
                    onClick={() => setEditingItem(item)}
                    className="text-neutral-700 cursor-pointer hover:text-purple-600"
                  >
                    {item.affirmation}
                  </p>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">No vision items yet. Start adding your dreams!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddVisionItemModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
          uploading={uploading}
        />
      )}
    </PageTransition>
  );
}

function AddVisionItemModal({
  onClose,
  onAdd,
  uploading,
}: {
  onClose: () => void;
  onAdd: (category: VisionBoardCategory, affirmation: string, file?: File) => void;
  uploading: boolean;
}) {
  const [category, setCategory] = useState<VisionBoardCategory>('Career');
  const [affirmation, setAffirmation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      console.log('File selected in modal:', selectedFile.name);
      setError(null);
    }
  };

  const handleSubmit = () => {
    if (!affirmation.trim()) {
      setError('Please enter an affirmation');
      return;
    }
    console.log('Submitting form with file:', file?.name);
    onAdd(category, affirmation, file || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Add Vision Item</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VisionBoardCategory)}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Affirmation</label>
            <textarea
              value={affirmation}
              onChange={(e) => setAffirmation(e.target.value)}
              className="textarea-calm"
              placeholder="I am healthy, wealthy, and wise..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {preview && (
              <div className="mt-4 relative h-48 rounded-xl overflow-hidden bg-stone-200">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={uploading}>
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
