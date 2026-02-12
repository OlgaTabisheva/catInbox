'use client';
import { useOptimistic, startTransition, useState } from 'react';
import { toggleProductStatus, deleteProduct, updateProduct } from '../app/actions';
import Image from 'next/image';
interface Product {
    id: number;
    name: string;
    inStock: boolean;
    location: string;
    imageUrl?: string | null;
}
interface ProductCardProps {
    product: Product;
    isShoppingList?: boolean;
    isLoggedIn: boolean;
}
export default function ProductCard({ product, isShoppingList = false, isLoggedIn }: ProductCardProps) {
    const [optimisticInStock, setOptimisticInStock] = useOptimistic(
        product.inStock,
        (state, newValue: boolean) => newValue
    );
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(product.name);
    const displayImage = product.imageUrl || 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9fa.png';
    const handleToggle = async () => {
        if (isEditing) return;
        if (!isLoggedIn) {
            alert("Пожалуйста, войдите в систему, чтобы изменять продукты.");
            return;
        }
        const newStatus = !optimisticInStock;
        startTransition(() => {
            setOptimisticInStock(newStatus);
        });
        try {
            await toggleProductStatus(product.id, product.inStock);
        } catch (e) {
            console.error('Failed to toggle', e);
        }
    };
    const handleDelete = async () => {
        setIsDeleting(true);
        setShowDeleteConfirm(false);
        try {
            await deleteProduct(product.id, isShoppingList ? 'shopping-list' : product.location as any);
        } catch (e) {
            console.error("Failed to delete", e);
            setIsDeleting(false);
        }
    };
    const handleSaveEdit = async () => {
        setIsEditing(false);
        if (editName.trim() === product.name) return;
        try {
            await updateProduct(product.id, editName);
        } catch (e) {
            console.error("Failed to update", e);
        }
    };
    const hasItem = optimisticInStock;
    let buttonText = "Ой! Купить";
    let buttonIcon = "🙀";
    if (isShoppingList) {
        buttonText = "Добавить в закрома";
        buttonIcon = "✅";
    } else {
        if (hasItem) {
            buttonText = "Мяу! Есть";
            buttonIcon = "😺";
        } else {
            buttonText = "Ой! Купить";
            buttonIcon = "🙀";
        }
    }
    if (isShoppingList && hasItem) {
        return null;
    }
    if (isDeleting) {
        return null;
    }
    return (
        <div className={`relative p-4 rounded-3xl shadow-lg transition-all transform hover:scale-[1.02] flex flex-col justify-between h-full min-h-[19rem] border-4 group ${hasItem ? 'border-green-400 bg-white' : 'border-red-400 bg-red-50'
            }`}>
            { }
            {isLoggedIn && !isEditing && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                    className="absolute top-2 right-2 z-20 bg-white/80 hover:bg-red-500 hover:text-white text-slate-400 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm"
                    title="Удалить"
                >
                    ✕
                </button>
            )}
            { }
            {isLoggedIn && !isEditing && (
                <button
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                    className="absolute top-2 left-2 z-20 bg-white/80 hover:bg-blue-500 hover:text-white text-slate-400 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm"
                    title="Редактировать"
                >
                    ✎
                </button>
            )}
            { }
            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-white/95 z-50 rounded-2xl flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-200">
                    <p className="font-bold text-slate-800 mb-4">Вы уверены, что хотите удалить «{product.name}»?</p>
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200"
                        >
                            Нет
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 py-2 rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
                        >
                            Да
                        </button>
                    </div>
                </div>
            )}
            { }
            <div className="relative w-full aspect-square mb-3 rounded-2xl overflow-hidden shadow-inner bg-slate-50/50 flex items-center justify-center">
                <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className={`object-contain p-4 transition-opacity ${isEditing ? 'opacity-50 blur-sm' : ''}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!isShoppingList && !isEditing && (
                    <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-bold shadow-sm z-10 ${hasItem ? 'bg-green-100/90 text-green-800' : 'bg-red-100/90 text-red-800'
                        }`}>
                        {hasItem ? 'В наличии' : 'Нужно купить'}
                    </div>
                )}
            </div>
            <div className="flex-grow flex flex-col justify-end">
                {isEditing ? (
                    <div className="mb-3">
                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full text-center font-heading font-black text-lg border-2 border-blue-400 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-200 text-slate-600 rounded-lg py-1 text-xs font-bold">Отмена</button>
                            <button onClick={handleSaveEdit} className="flex-1 bg-blue-500 text-white rounded-lg py-1 text-xs font-bold">Сохранить</button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center font-heading font-black text-lg md:text-xl text-slate-700 uppercase tracking-wide leading-tight break-words hyphens-auto mb-3 min-h-[3.5rem] flex items-center justify-center">
                        {product.name}
                    </div>
                )}
                {!isEditing && (
                    <button
                        onClick={handleToggle}
                        className={`px-4 py-3 rounded-2xl font-bold text-sm md:text-base shadow-md transition-colors w-full active:scale-95 flex items-center justify-center gap-2 ${hasItem
                            ? 'bg-green-400 hover:bg-green-500 text-white'
                            : 'bg-red-400 hover:bg-red-500 text-white'
                            }`}
                    >
                        <span className="text-xl">{buttonIcon}</span>
                        <span>{buttonText}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
