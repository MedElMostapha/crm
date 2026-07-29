"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Note } from "@/types";
import { createNote, deleteNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { formatDateTime } from "@/utils";
import { Trash2 } from "lucide-react";

interface CustomerNotesProps {
  customerId: string;
  notes: Note[];
}

export function CustomerNotes({ customerId, notes }: CustomerNotesProps) {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPending(true);
    const result = await createNote({ customerId, content });
    setIsPending(false);

    if (result.success) {
      toast.success("Note added");
      setContent("");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteNote(id, customerId);
    if (result.success) {
      toast.success("Note deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? "Adding..." : "Add Note"}
        </Button>
      </form>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="flex items-start justify-between p-4">
                <div className="space-y-1">
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(note.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(note.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
