"use client";

import { fetchAdapter } from "@/adapters/fetchAdapter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuth } from "@clerk/nextjs";

export const DeleteCategoryDialog = ({
  resolvedParams,
  title,
}: {
  resolvedParams: { uuid: string };
  title: string;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { userId } = useAuth();

  const handleDeleteCategory = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetchAdapter({
        method: "POST",
        path: "categories/delete",
        body: {
          uuid: resolvedParams.uuid,
          userId,
        },
      });
      if (response.status == 200) {
        toast({
          title: "Category deleted",
        });
        router.push("/categories");
      } else {
        toast({
          title: String(response.status),
          description: response.data,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data || "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[490px] h-[130px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete {title}?</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleDeleteCategory}>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" type="button" variant="outline">
                No
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full"
              variant="destructive"
              disabled={submitting}
            >
              {submitting ? <ReloadIcon className="animate-spin" /> : "Yes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
