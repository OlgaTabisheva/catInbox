'use client';
import { useOptimistic, startTransition, useState } from 'react';
import { toggleProductStatus, deleteProduct, updateProduct } from '../app/actions';
import Image from 'next/image';
import { useTranslation } from '../app/TranslationProvider';
interface Product {
    id: number;
    name: string;
    inStock: boolean;
    location: string;
    imageUrl?: string | null;
    originalName?: string;
}
interface ProductCardProps {
    product: Product;
    isShoppingList?: boolean;
    isLoggedIn: boolean;
}
export default function ProductCard({ product, isShoppingList = false, isLoggedIn }: ProductCardProps) {
    const t = useTranslation();
    const [optimisticInStock, setOptimisticInStock] = useOptimistic(
        product.inStock,
        (state, newValue: boolean) => newValue
    );
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(product.originalName || product.name);
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
        const refName = product.originalName || product.name;
        if (editName.trim() === refName) return;
        try {
            await updateProduct(product.id, editName);
        } catch (e) {
            console.error("Failed to update", e);
        }
    };
    const hasItem = optimisticInStock;
    let buttonText = t.buy;
    let buttonIcon = null;

    if (isShoppingList) {
        buttonText = t.addToStash;
        buttonIcon = <span className="text-xl">✅</span>;
    } else {
        if (hasItem) {
            buttonText = t.have;
        } else {
            buttonText = t.buy;
        }
    }
    if (isShoppingList && hasItem) {
        return null;
    }
    if (isDeleting) {
        return null;
    }
    return (
        <div
            draggable={isLoggedIn && !isEditing}
            onDragStart={(e) => {
                if (isLoggedIn && !isEditing) {
                    e.dataTransfer.setData('productId', product.id.toString());
                    e.dataTransfer.setData('sourceLocation', product.location);
                }
            }}
            className={`relative p-3 md:p-5 rounded-3xl shadow-sm transition-all flex flex-col justify-between h-full min-h-[12rem] border group hover:shadow-md hover:border-primary100 ${hasItem ? 'border-sand30 bg-sand60 text-white' : 'border-secondary bg-[#FFCDB2] text-slate-800'
                }`}>
            {isLoggedIn && !isEditing && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                    className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-sand10 border border-sand30 text-primary100 hover:bg-primary100 hover:text-white transition-colors shadow-none text-sm"
                    title={t.deleteConfirm}
                >
                    ✕
                </button>
            )}
            {isLoggedIn && !isEditing && (
                <button
                    onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                    className="absolute top-2 left-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-sand10 border border-sand30 text-primary100 hover:bg-primary100 hover:text-white transition-colors shadow-none text-sm"
                    title={t.edit}
                >
                    ✎
                </button>
            )}
            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-white/95 z-50 rounded-xl flex flex-col items-center justify-center p-2 text-center animate-in fade-in zoom-in duration-200">
                    <p className="font-bold text-slate-800 mb-2 text-xs">{t.deleteConfirm} «{product.name}»?</p>
                    <div className="flex gap-1 w-full justify-center">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 py-1 rounded bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 text-xs"
                        >
                            {t.no}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 py-1 rounded bg-primary100 font-bold text-white hover:bg-primary140 text-xs"
                        >
                            {t.yes}
                        </button>
                    </div>
                </div>
            )}
            <div className="relative w-full aspect-square mb-1 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className={`object-contain p-2 transition-opacity ${isEditing ? 'opacity-50 blur-sm' : ''}`}
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                />
            </div>
            <div className="flex-grow flex flex-col justify-end">
                {isEditing ? (
                    <div className="mb-1">
                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full text-center font-heading font-bold text-xs border-2 border-blue-400 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            autoFocus
                        />
                        <div className="flex gap-1 mt-1">
                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-200 text-slate-600 rounded py-1 text-[10px] font-bold">{t.cancel}</button>
                            <button onClick={handleSaveEdit} className="flex-1 bg-blue-500 text-white rounded py-1 text-[10px] font-bold">{t.save}</button>
                        </div>
                    </div>
                ) : (
                    <div className={`text-center font-heading font-black text-xs md:text-sm uppercase tracking-wide leading-tight break-words hyphens-auto mb-2 min-h-[2rem] flex items-center justify-center ${hasItem ? 'text-white' : 'text-slate-800'}`}>
                        {product.name}
                    </div>
                )}
                {!isEditing && (
                    <button
                        onClick={handleToggle}
                        className={`px-2 py-2 rounded-lg font-bold text-xs md:text-sm shadow-sm transition-colors w-full active:scale-95 flex items-center justify-center gap-2 ${hasItem
                            ? 'bg-primary100 hover:bg-primary140 text-white'
                            : 'bg-primary100 opacity-80 hover:opacity-100 text-white'
                            }`}
                    >
                        <span className="hidden sm:inline-flex items-center">{buttonIcon}</span>
                        <span className="leading-tight">{buttonText}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
