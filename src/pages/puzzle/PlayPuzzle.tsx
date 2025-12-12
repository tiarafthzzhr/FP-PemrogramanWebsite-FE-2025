"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetPlayPuzzle } from "@/pages/puzzle/hooks/useGetPlayPuzzle";
import { useFinishPuzzle } from "@/pages/puzzle/hooks/useFinishPuzzle";
import { usePuzzleGame } from "@/pages/puzzle/hooks//usePuzzleGame";

export default function PlayPuzzle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<Array<{ x: number; y: number; correctX: number; correctY: number; img: HTMLImageElement }>>([]);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showExitDialog, setShowExitDialog] = useState(false);

  const { puzzle, isLoading, startPuzzle, session, isStarting } = useGetPlayPuzzle(id || "");
  const { mutate: finish } = useFinishPuzzle();

  const gameJson = session?.gameJson;
  const sessionId = session?.sessionId;

  const { 
    isPlaying, 
    isPaused, 
    elapsedSec, 
    moveCount, 
    remainingTime, 
    isFinished,
    startGame, 
    pauseGame, 
    incrementMove, 
    finishGame 
  } = usePuzzleGame({
    gameJson: gameJson!,
    sessionId: sessionId!,
    gameId: id!,
    onFinish: (durationSec, moves) => {
      finish({ sessionId: sessionId!, gameId: id!, moveCount: moves });
    },
  });

  // Load & cut image into pieces
  useEffect(() => {
    if (!gameJson || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = gameJson.imageUrl;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      canvas.width = window.innerWidth - 100;
      canvas.height = window.innerHeight - 200;

      const pieceWidth = img.width / gameJson.cols;
      const pieceHeight = img.height / gameJson.rows;

      const newPieces = [];
      for (let row = 0; row < gameJson.rows; row++) {
        for (let col = 0; col < gameJson.cols; col++) {
          const pieceCanvas = document.createElement("canvas");
          pieceCanvas.width = pieceWidth;
          pieceCanvas.height = pieceHeight;
          const pieceCtx = pieceCanvas.getContext("2d")!;
          pieceCtx.drawImage(img, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

          const pieceImg = new Image();
          pieceImg.src = pieceCanvas.toDataURL();

          newPieces.push({
            x: Math.random() * (canvas.width - pieceWidth),
            y: Math.random() * (canvas.height - pieceHeight) + 200,
            correctX: col * pieceWidth + (canvas.width - img.width) / 2,
            correctY: row * pieceHeight + 100,
            img: pieceImg,
          });
        }
      }
      setPieces(newPieces);
    };
  }, [gameJson]);

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current || pieces.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((piece, index) => {
      ctx.drawImage(piece.img, piece.x, piece.y);
      if (isPlaying) {
        // Snap check
        if (Math.abs(piece.x - piece.correctX) < 20 && Math.abs(piece.y - piece.correctY) < 20) {
          piece.x = piece.correctX;
          piece.y = piece.correctY;
        }
      }
    });

    // Check if finished
    if (isPlaying && pieces.every(p => Math.abs(p.x - p.correctX) < 20 && Math.abs(p.y - p.correctY) < 20)) {
      finishGame();
    }
  }, [pieces, isPlaying, finishGame]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (x > piece.x && x < piece.x + piece.img.width && y > piece.y && y < piece.y + piece.img.height) {
        setDraggedPiece(i);
        setDragOffset({ x: x - piece.x, y: y - piece.y });
        incrementMove();
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedPiece === null) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setPieces(prev => {
      const newPieces = [...prev];
      newPieces[draggedPiece] = { ...newPieces[draggedPiece], x, y };
      return newPieces;
    });
  };

  const handleMouseUp = () => {
    setDraggedPiece(null);
  };

  if (isLoading) return <div className="text-center">Loading puzzle...</div>;

  if (!session) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle>{puzzle?.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <img src={puzzle?.thumbnail_image || puzzle?.game_json.thumbnail} alt="thumbnail" className="mx-auto rounded-lg mb-4" />
          <Button onClick={() => startPuzzle(id!)} disabled={isStarting}>
            {isStarting ? "Starting..." : "Start Puzzle"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Button variant="outline" onClick={pauseGame}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <span className="text-lg font-semibold">
            Time: {remainingTime !== null ? remainingTime : elapsedSec}s
          </span>
          <span className="text-lg font-semibold">Moves: {moveCount}</span>
        </div>
        <Button variant="destructive" onClick={() => setShowExitDialog(true)}>
          Exit
        </Button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="mt-20 block mx-auto cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Puzzle?</DialogTitle>
            <DialogDescription>
              {isPlaying ? "Progress akan disimpan sebagai unfinished" : "Kamu yakin mau keluar?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              if (isPlaying) finishGame();
              navigate("/");
            }}>Exit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finish Screen */}
      {isFinished && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <CardTitle className="text-3xl mb-4">Congratulations! 🎉</CardTitle>
            <p className="text-xl mb-2">Time: {elapsedSec}s</p>
            <p className="text-xl mb-6">Moves: {moveCount}</p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </Card>
        </div>
      )}
    </div>
  );
}