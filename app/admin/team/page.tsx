"use client";

import { useState, useEffect, useRef } from "react";
import { api, BackendTeamMember } from "@/lib/api";
import Image from "next/image";
import Skeleton from "@/components/ui/Skeleton";
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

/**
 * Admin Team Page - Kelola Tim Operasional dan Tutor
 */

const roleTypes = [
    { value: "OPERASIONAL", label: "Tim Operasional" },
    { value: "TUTOR", label: "Tutor" },
];

function SortableMember({ id, member, onEdit, onDelete }: { id: string, member: BackendTeamMember, onEdit: any, onDelete: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all group relative border border-transparent hover:border-secondary/20"
        >
            {/* Drag Handle */}
            <button 
                {...attributes} 
                {...listeners}
                className="absolute top-4 right-4 p-1.5 text-primary/20 hover:text-primary cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="w-4 h-4" />
            </button>

            <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-gray-50">
                <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="96px" />
            </div>
            <h3 className="font-bold text-primary truncate px-2">{member.name}</h3>
            <p className="text-primary/60 text-sm truncate px-2">{member.position}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${member.role_type === 'OPERASIONAL' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{member.role_type_display}</span>
            <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(member)} className="px-3 py-1 text-sm text-primary/40 hover:text-primary">Edit</button>
                <button onClick={() => onDelete(member.id)} className="px-3 py-1 text-sm text-red-400 hover:text-red-600">Delete</button>
            </div>
        </div>
    );
}

export default function AdminTeamPage() {
    const [members, setMembers] = useState<BackendTeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<BackendTeamMember | null>(null);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({ name: "", position: "", role_type: "TUTOR" });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = members.findIndex((m) => m.id === active.id);
            const newIndex = members.findIndex((m) => m.id === over.id);
            
            const newItems = arrayMove(members, oldIndex, newIndex);
            setMembers(newItems);

            try {
                await api.content.reorderTeamMembers(newItems.map(i => i.id));
            } catch (error) {
                console.error("Failed to reorder:", error);
                fetchData();
            }
        }
    }

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const data = await api.content.team();
            setMembers(data.results);
        } catch (error) { console.error("Failed to fetch team:", error); }
        finally { setLoading(false); }
    };

    const resetForm = () => {
        setFormData({ name: "", position: "", role_type: "TUTOR" });
        setPhotoFile(null);
        setPhotoPreview(null);
        setEditingItem(null);
    };

    const openModal = (item?: BackendTeamMember) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, position: item.position, role_type: item.role_type });
            setPhotoPreview(item.photo);
        } else { resetForm(); }
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); resetForm(); };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("position", formData.position);
            data.append("role_type", formData.role_type);
            if (photoFile) data.append("photo", photoFile);

            if (editingItem) {
                await api.content.updateTeamMember(editingItem.id, data);
            } else {
                await api.content.createTeamMember(data);
            }
            await fetchData();
            closeModal();
        } catch (error: any) {
            alert(error.message || "Gagal menyimpan anggota tim");
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus anggota tim ini?")) return;
        try {
            await api.content.deleteTeamMember(id);
            await fetchData();
        } catch (error: any) { alert(error.message || "Gagal menghapus anggota tim"); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Team Members</h1>
                    <p className="text-primary/60">Kelola Tim Operasional dan Tutor</p>
                </div>
                <button onClick={() => openModal()} className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Anggota
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 space-y-4">
                            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-1/2 mx-auto" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                        </div>
                    ))
                ) : members.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center text-primary/40">Belum ada anggota tim.</div>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={members.map(m => m.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {members.map((member) => (
                                <SortableMember 
                                    key={member.id} 
                                    id={member.id} 
                                    member={member} 
                                    onEdit={openModal} 
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
                        <h2 className="text-xl font-bold text-primary mb-6">{editingItem ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-primary/60 mb-2">Foto</label>
                                <div className="flex items-center gap-4">
                                    {photoPreview ? (
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden">
                                            <Image src={photoPreview} alt="Preview" fill className="object-cover" sizes="80px" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-primary/30">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Pilih Foto</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary/60 mb-2">Nama Lengkap</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-secondary" placeholder="Contoh: Rika Dewantari, S.Pd." required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary/60 mb-2">Jabatan</label>
                                <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-secondary" placeholder="Contoh: Koordinator Program" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-primary/60 mb-2">Tipe</label>
                                <select value={formData.role_type} onChange={(e) => setFormData({ ...formData, role_type: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-secondary">
                                    {roleTypes.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-4 justify-end pt-4">
                                <button type="button" onClick={closeModal} className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50" disabled={submitting}>Batal</button>
                                <button type="submit" className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
