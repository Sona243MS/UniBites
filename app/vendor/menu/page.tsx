"use client";

import { useState, useRef, useEffect } from 'react';
import { MenuItem, MealPeriod } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { useMenu } from '@/context/MenuContext';
import { Pencil, Trash2, Plus, X, Save, Upload, Search } from 'lucide-react';


export default function MenuManager() {
    const { user } = useAuth();
    const { items, addItem, updateItem, deleteItem } = useMenu();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Snacks');
    const [newItemIsDaily, setNewItemIsDaily] = useState(false);
    const [newItemIsAvailable, setNewItemIsAvailable] = useState(true);
    const [newItemPeriods, setNewItemPeriods] = useState<MealPeriod[]>(['Snacks']);
    const [newItemImage, setNewItemImage] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');
    const [previewError, setPreviewError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Reset preview error when image changes
    useEffect(() => {
        setPreviewError(false);
    }, [newItemImage]);

    // Filter items for current vendor and search query
    const vendorItems = items.filter(i => {
        const isVendorItem = i.canteenId === user?.canteenId;
        const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (i.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return isVendorItem && matchesSearch;
    });

    const resetForm = () => {
        setNewItemName('');
        setNewItemPrice('');
        setNewItemCategory('Snacks');
        setNewItemIsDaily(false);
        setNewItemIsAvailable(true);
        setNewItemPeriods(['Snacks']);
        setNewItemImage('');
        setNewItemDescription('');
        setEditId(null);
        setIsEditing(false);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItemImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.canteenId) return;

        if (editId) {
            // Update existing
            updateItem(editId, {
                name: newItemName,
                price: Number(newItemPrice),
                category: newItemCategory,
                mealPeriod: newItemPeriods,
                isDaily: newItemIsDaily,
                isAvailable: newItemIsAvailable,
                image: newItemImage,
                description: newItemDescription
            });
        } else {
            // Add new
            const newItem: MenuItem = {
                id: `m${Date.now()}`,
                canteenId: user.canteenId,
                name: newItemName,
                price: Number(newItemPrice),
                category: newItemCategory,
                mealPeriod: newItemPeriods,
                type: 'veg',
                isHealthy: true,
                isDaily: newItemIsDaily,
                isAvailable: newItemIsAvailable,
                rating: 5.0,
                prepTime: '15m',
                image: newItemImage,
                description: newItemDescription
            };
            addItem(newItem);
        }
        resetForm();
    };

    const handleEditClick = (item: MenuItem) => {
        setEditId(item.id);
        setNewItemName(item.name);
        setNewItemPrice(item.price.toString());
        setNewItemCategory(item.category);
        setNewItemIsDaily(item.isDaily);
        setNewItemIsAvailable(item.isAvailable !== false); // Default to true if undefined
        setNewItemPeriods(item.mealPeriod);
        setNewItemImage(item.image || '');
        setNewItemDescription(item.description || '');
        setIsEditing(true);
    };

    const handleDeleteClick = (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteItem(id);
        }
    };

    const togglePeriod = (period: MealPeriod) => {
        setNewItemPeriods(prev =>
            prev.includes(period)
                ? prev.filter(p => p !== period)
                : [...prev, period]
        );
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-gray-500 mt-1">Manage your daily menu and prices.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {showSearch ? (
                            <div className="relative group animate-in fade-in slide-in-from-right-2 duration-300">
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="pl-10 pr-10 py-2 bg-white border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-64 shadow-sm"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
                                    <Search size={18} />
                                </div>
                                <button
                                    onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                title="Search Menu"
                            >
                                <Search size={22} />
                            </button>
                        )}
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <Plus size={18} /> Add New Item
                        </button>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="mb-8 p-6 bg-green-50 border border-green-100 rounded-xl animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-green-900 text-lg">{editId ? 'Edit Item' : 'Add New Item'}</h3>
                        <button onClick={resetForm} className="text-green-400 hover:text-green-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSaveItem} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-green-800 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Veg Biryani"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-green-800 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    value={newItemPrice}
                                    onChange={(e) => setNewItemPrice(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block text-sm font-medium text-green-800 mb-1">Description</label>
                            <textarea
                                value={newItemDescription}
                                onChange={(e) => setNewItemDescription(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                placeholder="Describe the item (ingredients, taste, portion size, etc.)"
                                rows={3}
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-green-800 mb-2">Item Image</label>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-green-200 bg-gray-100 flex items-center justify-center">
                                    {newItemImage && !previewError ? (
                                        <img
                                            key={newItemImage}
                                            src={newItemImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setPreviewError(true)}
                                        />
                                    ) : (
                                        <span className="text-4xl">🍲</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-lg text-green-700 font-medium hover:bg-green-50 transition"
                                    >
                                        <Upload size={16} />
                                        {editId ? 'Change Image' : 'Upload Image'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-green-800 mb-2">Meal Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'] as MealPeriod[]).map((period) => (
                                        <button
                                            key={period}
                                            type="button"
                                            onClick={() => togglePeriod(period)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${newItemPeriods.includes(period)
                                                ? 'bg-green-600 text-white shadow-sm scale-105'
                                                : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                                                }`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-green-800 mb-2">Availability</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newItemIsAvailable}
                                            onChange={(e) => setNewItemIsAvailable(e.target.checked)}
                                            className="w-4 h-4 text-green-600 rounded"
                                        />
                                        <span className="text-sm font-bold text-green-700">In Stock</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                                <Save size={18} /> {editId ? 'Update Item' : 'Save Item'}
                            </button>
                            <button type="button" onClick={resetForm} className="px-6 py-3 bg-white text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-800">Item Details</th>
                            <th className="p-4 font-semibold text-gray-800">Meal Type</th>
                            <th className="p-4 font-semibold text-gray-800">Type</th>
                            <th className="p-4 font-semibold text-gray-800">Price</th>
                            <th className="p-4 font-semibold text-gray-800 text-center">Status</th>
                            <th className="p-4 font-semibold text-gray-800 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vendorItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No items found. Add your first menu item!
                                </td>
                            </tr>
                        ) : (
                            vendorItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div key={`img-${item.id}-${item.image?.slice(-20) || 'none'}`} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const parent = target.parentElement;
                                                            if (parent && !parent.querySelector('.emoji-fallback')) {
                                                                const span = document.createElement('span');
                                                                span.className = 'text-2xl emoji-fallback';
                                                                span.innerText = '🍲';
                                                                parent.appendChild(span);
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-2xl">🍲</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.description || item.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {item.mealPeriod.map(p => (
                                                <span key={p} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {item.isDaily ? (
                                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold border border-amber-200">
                                                Daily Special
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                                Default
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">₹{item.price}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => updateItem(item.id, { isAvailable: !item.isAvailable })}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition border ${item.isAvailable !== false
                                                    ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${item.isAvailable !== false ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {item.isAvailable !== false ? 'IN STOCK' : 'OUT STOCK'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                title="Edit Item"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
