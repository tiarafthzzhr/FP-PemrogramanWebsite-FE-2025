# 🧩 Puzzle Game Module

## Overview
The Puzzle Game is a drag-and-drop image puzzle where users must arrange shuffled pieces to recreate the original image.

## 📄 Pages

| Page | Path | Description |
|------|------|-------------|
| Create Puzzle | `/games/puzzle/create` | Halaman untuk membuat puzzle baru |
| Edit Puzzle | `/games/puzzle/edit/:game_id` | Halaman untuk edit puzzle |
| Play Puzzle | `/games/puzzle/play/:game_id` | Halaman gameplay puzzle (public) |
| Preview Puzzle | `/games/puzzle/preview/:game_id` | Preview sebelum publish |

## 🔗 API Endpoints

Base URL: `/api/game/game-type/puzzle`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ Ya | Buat puzzle baru |
| `GET` | `/:game_id` | ✅ Ya | Ambil detail puzzle (untuk edit) |
| `GET` | `/:game_id/play/public` | ❌ Tidak | Ambil data puzzle untuk main |
| `GET` | `/:game_id/play/private` | ✅ Ya | Ambil data puzzle untuk preview |
| `PATCH` | `/:game_id` | ✅ Ya | Update puzzle |
| `DELETE` | `/:game_id` | ✅ Ya | Hapus puzzle |
| `POST` | `/:game_id/check` | ❌ Tidak | Submit & cek hasil puzzle |

## ✨ Features

- ✅ Create puzzle dengan upload gambar
- ✅ Edit puzzle (nama, gambar, difficulty, dll)
- ✅ Delete puzzle
- ✅ Play puzzle dengan drag-and-drop
- ✅ Timer countdown
- ✅ Move counter
- ✅ Score calculation
- ✅ Responsive design
- ✅ Exit button dengan play count

### Form Fields
- **name** (required): Max 128 characters
- **description** (optional): Max 256 characters
- **thumbnail_image** (required for create): Game thumbnail
- **puzzle_image** (required for create): Image to be made into puzzle
- **difficulty** (required): easy, medium, hard
- **grid_size** (required): 2-6 (creates NxN grid)
- **time_limit** (optional): 30-3600 seconds
- **max_moves** (optional): 10-1000 moves

### Error Handling
- ❌ Error 500 = Tampilkan error message (BUKAN default value)
- ❌ Error 403 = Permission denied
- ❌ Error 404 = Puzzle not found

## 📁 File Structure
```
src/pages/games/puzzle/
├── create.tsx      # Halaman create
├── edit.tsx        # Halaman edit
├── play.tsx        # Halaman play (public/private)
├── preview.tsx     # Preview wrapper
├── index.ts        # Exports
└── README.md       # Documentation
```

## 🎮 Gameplay Logic

1. `grid_size = 3` berarti grid 3x3 = 9 potongan (pieces)
2. Gambar `puzzle_image` dipotong jadi 9 bagian
3. Pieces sudah diacak oleh backend (`current_position` ≠ `correct_position`)
4. User drag-and-drop atau click untuk menukar posisi pieces
5. Puzzle selesai jika semua `current_position === id`

## 🚀 Backend Commands

```bash
cd FP-PemrogramanWebsite-BE-2025
bun docker:up:dev    # Start database
bun migrate:dev      # Migrate schema
bun seed:dev         # Seed data
bun start:dev        # Start server
```
