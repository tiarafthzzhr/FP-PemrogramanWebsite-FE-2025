import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { z } from "zod";
import { type PuzzleGame } from "./types";

const editPuzzleSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  rows: z.coerce.number().int().min(3).max(10),
  cols: z.coerce.number().int().min(3).max(10),
  difficulty: z.enum(["easy", "medium", "hard"]),
  is_published: z.boolean(),
});

type EditPuzzleForm = z.infer<typeof editPuzzleSchema>;

export default function EditPuzzle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: puzzle, isLoading } = useQuery({
    queryKey: ["puzzle-edit", id],
    queryFn: async (): Promise<PuzzleGame> => {
      const response = await axiosInstance.get(`/game/game-list/puzzle/${id}/edit`);
      return response.data.data;
    },
    enabled: !!id,
  });

  const form = useForm<EditPuzzleForm>({
    resolver: zodResolver(editPuzzleSchema),
  });

  useEffect(() => {
    if (puzzle) {
      form.reset({
        name: puzzle.name,
        description: puzzle.description ?? "",
        imageUrl: puzzle.game_json.imageUrl,
        thumbnail: puzzle.game_json.thumbnail ?? "",
        rows: puzzle.game_json.rows,
        cols: puzzle.game_json.cols,
        difficulty: puzzle.game_json.difficulty,
        is_published: puzzle.is_published,
      });
    }
  }, [puzzle, form]);

  const mutation = useMutation({
    mutationFn: (data: EditPuzzleForm) => {
      const payload = {
        ...data,
        thumbnail: data.thumbnail || data.imageUrl,
      };
      return axiosInstance.put(`/game/game-list/puzzle/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puzzle-list"] });
      navigate("/my-projects");
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Puzzle</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            {/* Sama persis kayak CreatePuzzle, cuma button "Update" */}
            {/* ... copy semua FormField dari CreatePuzzle di sini ... */}
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Menyimpan..." : "Update Puzzle"}
            </Button>
          </form>
        </FormField>
      </CardContent>
    </Card>
  );
}