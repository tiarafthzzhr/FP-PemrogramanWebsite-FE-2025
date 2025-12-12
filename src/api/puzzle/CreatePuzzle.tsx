// src/pages/puzzle/CreatePuzzle.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TextareaField } from "@/components/ui/textarea-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { z } from "zod";
import { type PuzzleFormValues } from "./types";

const createPuzzleSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  description: z.string().optional(),
  imageUrl: z.string().url("Harus URL gambar valid"),
  thumbnail: z.string().url("Harus URL thumbnail valid").optional().or(z.literal("")),
  rows: z.coerce.number().int().min(3).max(10),
  cols: z.coerce.number().int().min(3).max(10),
  difficulty: z.enum(["easy", "medium", "hard"]),
  is_published: z.boolean().default(false),
});

type CreatePuzzleForm = z.infer<typeof createPuzzleSchema>;

export default function CreatePuzzle() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(createPuzzleSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      thumbnail: "",
      rows: 4,
      cols: 4,
      difficulty: "easy",
      is_published: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreatePuzzleForm) => {
      const payload = {
        ...data,
        thumbnail: data.thumbnail || data.imageUrl,
      };
      await axiosInstance.post("/game/game-list/puzzle", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puzzle-list"] });
      navigate("/my-projects"); 
    },
  });

  const onSubmit = (data: CreatePuzzleForm) => {
    setIsSubmitting(true);
    mutation.mutate(data, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Buat Puzzle Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nama */}
          <FormField
            label="Nama Puzzle"
            required
            placeholder="Contoh: Alam Pegunungan"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
          )}

          {/* Deskripsi */}
          <TextareaField
            label="Deskripsi (opsional)"
            optionalLabel
            placeholder="beri deskripsi pada puzzle ini..."
            {...form.register("description")}
          />

          {/* Image URL */}
          <FormField
            label="URL Gambar Utama"
            required
            placeholder="https://example.com/image.jpg"
            {...form.register("imageUrl")}
          />
          {form.formState.errors.imageUrl && (
            <p className="text-red-500 text-sm">{form.formState.errors.imageUrl.message}</p>
          )}

          {/* Thumbnail */}
          <FormField
            label="URL Thumbnail (opsional)"
            optionalLabel
            placeholder="https://example.com/thumbnail.jpg"
            {...form.register("thumbnail")}
          />

          {/* Rows & Cols */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Jumlah Baris"
              required
              type="number"
              {...form.register("rows", { valueAsNumber: true })}
            />
            <FormField
              label="Jumlah Kolom"
              required
              type="number"
              {...form.register("cols", { valueAsNumber: true })}
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Tingkat Kesulitan</Label>
            <Select onValueChange={(value) => form.setValue("difficulty", value as "easy" | "medium" | "hard")} defaultValue="easy">
              <SelectTrigger>
                <SelectValue placeholder="Pilih kesulitan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Membuat..." : "Buat Puzzle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}